import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { adminClient } from "../adminClient";

export async function upvoteComment(commentId:string, userId:string){
    //check if user has already votes on this comment
    const exisitingVoteUpvoteCommentQuery = defineQuery(`
        *[_type =="vote" && comment._ref == $commentId && user._ref == $userId][0]
        `)

        const exisitingVote = await sanityFetch({
            query:exisitingVoteUpvoteCommentQuery,
            params:{commentId, userId},
        })

        if(exisitingVote.data){
            const vote = exisitingVote.data;

            //if there is an upvote , remove it(toggle off)
            if(vote.voteType === "upvote"){
                return await adminClient.delete(vote._id)
            }

            //if there is an downvote, change it to upvote
            if(vote.voteType==="downvote"){
                return await adminClient
                .patch(vote._id)
                .set({voteType:"upvote"})
                .commit();
            }
        }
        //create a new upvote
        return await adminClient.create({
            _type:"vote",
            post:{
                _type:"reference",
                _ref:commentId,
            },
            user:{
                _type:"reference",
                _ref:userId,
            },
            voteType:"upvote",
            createdAt:new Date().toISOString(),
        })

}