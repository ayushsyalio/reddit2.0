"use server";

import { getUser } from "@/sanity/lib/user/getUser";
import { downvoteComment } from "@/sanity/lib/vote/downvoteComment";
import { downVotePost } from "@/sanity/lib/vote/downVotePost";


export async function downVote(
  contentId: string,
  contentType: "post" | "comment" = "post"
){
    const user = await getUser();
    if("error" in user){
        return {error:user.error}
    }

    if(contentType==="comment"){
        const vote = await downvoteComment(contentId, user._id);
        return {vote};
    }else{
        const vote = await downVotePost(contentId, user._id);
        return {vote};
    }
}
