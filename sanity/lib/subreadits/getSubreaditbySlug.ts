import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getSubreaditbySlug(slug:string){
    const lowercaseSlug = slug.toLowerCase()
    const getsubreaditbySlugQuery = defineQuery(`
        *[_type == "subreadit" && slug.current == $slug][0]{
        ...,
        "slug":slug.current,
        "moderator":moderator->,
        
        } `);

        const subreadit = await sanityFetch({
            query:getsubreaditbySlugQuery,
            params:{slug:lowercaseSlug},
        })

        return subreadit.data;
}