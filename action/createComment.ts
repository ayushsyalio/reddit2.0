"use server";

import addComment from "@/sanity/lib/comment/addComment";
import { getUser } from "@/sanity/lib/user/getUser";

//createComment is a server action
export default async function createComment(postId:string, parentCommentId:string, content:string){
    const user = await getUser();
    if("error" in user){
        return {error:user.error}
    }

    try {
        //addComment is a sanity mutation
        const comment = await addComment({
            postId,
            userId:user._id,
            content,
            parentCommentId,
        })
        return {comment}
        
    } catch (error) {
        console.error("Error adding comment:", error)
        return {error:"Failed to add comment"}
        
    }


}