import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getUserPostVote(postId:string, userId:string | null){
    const getUserPostVoteQuery = defineQuery(`*[_type == "vote" && post._ref == $postId && user._ref == $userId][0].voteType`);

    const result = await sanityFetch({
        query:getUserPostVoteQuery,
        params:{postId, userId:userId || ""},

    });
    
    //this will return "upvote", "downvote", or null if no vote.
    return result;

}