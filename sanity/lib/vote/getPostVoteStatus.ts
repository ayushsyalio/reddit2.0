import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getPostVoteStatus(postId:string, userId:string | null){
    const getPostVoteStatusQuery = defineQuery(`*[_type == "vote" && post._ref == $postId && user._ref == $userId][0].voteType`);

    const result = await sanityFetch({
        query:getPostVoteStatusQuery,
        params:{postId, userId:userId || ""}
    })

    return result.data;

}