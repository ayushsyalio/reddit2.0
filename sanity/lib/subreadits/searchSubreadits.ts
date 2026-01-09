import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function searchSubreadit(searchTerms:string){

    //skip empty search terms
    if(!searchTerms || searchTerms.trim() === ""){
        return [];
    }

    const searchSubreaditQuery = defineQuery(`
        *[_type =="subreadit" && title match $searchTerms + "*"]{
        _id,
        title,
        "slug":slug.current,
        description,
        image,
        "moderator":moderator->,
        createdAt
        } | order(createdAt desc)
        `)

        const result = await sanityFetch({
            query:searchSubreaditQuery,
            params:{searchTerms:searchTerms.toLowerCase()},//lower case is super imp
        })

        return result.data

}