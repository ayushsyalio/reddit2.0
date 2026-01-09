import { ImageData } from "@/action/createCommunity";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { adminClient } from "../adminClient";
import { Subreadit } from "@/sanity.types";


export async function createSubreadit(
    name:string,
    moderatorId:string,
    imageData:ImageData | null,
    customSlug?:string,
    customDescription?:string,
){
    console.log(`creating subreadit: ${name} with moderator: ${moderatorId}`)
    try {
        const checkingExistingQuery = defineQuery(`*[_type == "subreadit" && title == $name][0]{_id}`);

        const existingSubreadit = await sanityFetch({
            query:checkingExistingQuery,
            params:{name},
        });
        if(existingSubreadit.data){
            console.log(`Subreadit "${name}" already exists`);
            return {error:"A subreadit with this name already exists"}
        }

        if(customSlug){
            const checkSlugQuery = defineQuery(`
                *[_type == "subreadit" && slug.current == $slug][0]{
                _id
            }
        `);
        const existinSlug = await sanityFetch({
            query:checkSlugQuery,
            params:{slug:customSlug},
        })

        if(existinSlug.data){
            console.log(`Subreadit with slug "${customSlug}" already exists`)
            return {error:"A subreadit with this URL already exists"}
        }
    }

    const slug = customSlug || name.toLowerCase().replace(/\s+/g,"-")

    //upload image if provided
    let imageAsset;
    if(imageData){
        try {
            //extract base64 data(remove data:image/jpeg;base64, part)
            const base64Data = imageData.base64.split(",")[1];

            //convert base64 to buffer
            const buffer = Buffer.from(base64Data, "base64")

            //upload to sanity
            imageAsset = await adminClient.assets.upload("image", buffer,{
                filename:imageData.fileName,
                contentType:imageData.contentType,
            })
            console.log("Image Asset:", imageAsset)


        } catch (error) {
            console.error("Failed uploading file:", error)
            //continue without image if upload fails
            
        }
    }
    //create the subreadit
    const subreaditDocs:Partial<Subreadit>={
        _type:"subreadit",
        title:name,
        description:customDescription || `Welcome to r/${name}!`,
        slug:{
            current:slug,
            _type:"slug",
        },
        moderator:{
            _type:"reference",
            _ref:moderatorId,
        },
        createdAt:new Date().toISOString(),
    }

    //add image if available
    if(imageAsset){
        subreaditDocs.image = {
            _type:"image",
            asset:{
                _type:"reference",
                _ref:imageAsset._id
            },
        }
    }

    const subreadit = await adminClient.create(subreaditDocs as Subreadit);
    console.log(`Subreadit created successfully with ID: ${subreadit._id}`)

    return {subreadit};
        
    } catch (error) {
        console.error("Error creating subreadit: ", error)
        return {error: "Failed to create subreadit"};
        
    }

}