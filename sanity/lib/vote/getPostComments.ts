// import { defineQuery } from "groq";
// import { sanityFetch } from "../lib/live";

// export async function getPostComments(postId:string, userId:string){
//     const getPostCommentsQuery = defineQuery(`*[_type == "comment" && post._ref == $postId && !defined(parentComment)]{
//         ...,
//         _id,
//         content,
//         createdAt,
//         "author":author->,
//         "replies":*[_type == "comment" && parentComment._ref == ^._id],
//         "votes":{
//         "upvotes":count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]),

//         "downvotes":count(*[_type == "vote" && comment._ref == ^._id && voteType == 
//         "downvote"]),

//         "netScore":count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),

//         "voteStatus": *[_type == "vote" && comment._ref == ^._id && user._ref == $userId][0].voteType,
//         },

//      } | order(votes.netScore desc, createdAt desc) //votes.netScore desc ->
        
//      `);

//      const result = await sanityFetch({
//         query:getPostCommentsQuery,
//         params:{postId, userId:userId || ""},

//      })
//      return result.data || [];

// }

import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getPostComments(postId: string, userId: string | null) {
  const getPostCommentsQuery = defineQuery(`
    *[_type == "comment" && post._ref == $postId && !defined(parentComment)] | order(_createdAt desc) {
      _id,
      content,
      createdAt,
      "author": author->{
        _id,
        username,
        imageUrl
      },
      "replies": *[_type == "comment" && parentComment._ref == ^._id] | order(_createdAt asc) {
        _id,
        content,
        createdAt,
        "author": author->{
          _id,
          username,
          imageUrl
        },
        "votes": {
          "upvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]),
          "downvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
          "netScore": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
          "voteStatus": *[_type == "vote" && comment._ref == ^._id && user._ref == $userId][0].voteType
        }
      },
      "votes": {
        "upvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]),
        "downvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
        "netScore": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
        "voteStatus": *[_type == "vote" && comment._ref == ^._id && user._ref == $userId][0].voteType
      }
    }
  `);

  const result = await sanityFetch({
    query: getPostCommentsQuery,
    params: { postId, userId: userId || "" },
  });

  console.log("✅ COMMENTS DATA:", result.data); // <-- Add this for debugging

  return result.data || [];
}
