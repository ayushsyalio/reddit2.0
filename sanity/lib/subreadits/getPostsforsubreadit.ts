import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getPostsforsubreadit(id:string){
    const getPostsforsubreaditQuery = defineQuery(`
        *[_type == "post" && subreadit._ref == $id]{
        ...,
        "slug":slug.current,
        "author":author->,
        "subreadit":subreadit->,
        "category":category->,
        "upvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),

        "downvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),

        "netScore" : count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),

        "commentCount" : count(*[type == "comment" && post._ref == ^._id])
        } | order(publishedAt desc)
        `);

        const result = await sanityFetch({
            query:getPostsforsubreaditQuery,
            params:{id},
        })
        return result.data;

}