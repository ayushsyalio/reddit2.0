'use server'

import { adminClient } from "@/sanity/lib/adminClient";
import { getCommentById } from "@/sanity/lib/comment/getCommentById";
import { currentUser } from "@clerk/nextjs/server"

export async function deleteComments(commentId:string){
    const user = await currentUser();
    if(!user){
        return {error:"User not found"};
    }

    const comment = await getCommentById(commentId);
        if(!comment){
            return {error:"Comment not found"}
        }
        if(comment.author?._id !==user?.id){
            return {error:"You are not authorized to delete this comment"}
        }
        const patch = adminClient.patch(commentId);

        //delete content
        patch.set({content:"[DELETED]"})

        //set comment to deleted
        patch.set({isDeleted:true})

        //commit changes
        await patch.commit();

        //return success message
        return {success:"Comment deleted successfully"}
    }
