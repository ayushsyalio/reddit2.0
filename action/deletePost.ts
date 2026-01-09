'use server'

import { adminClient } from "@/sanity/lib/adminClient";
import { getPostsById } from "@/sanity/lib/post/getPostsById";
import { currentUser } from "@clerk/nextjs/server"

export  async function deletePost(postId:string){
    const user = await currentUser();
    if(!user){
        return {error: "User not found"}
    }
    const post = await getPostsById(postId);
    if(!post){
        return {error: "Post not found"}
    }
    console.log(post)
    console.log(post.author?._id, user?.id);

    if(post.author?._id !== user?.id){
        return {error:"You are not authorized to delete this post"}
    }

    const patch = adminClient.patch(postId)

    //delete image from post
    if(post.image?.asset?._ref){
        patch.set({image:null})
    }
    //set post to delete
    patch.set({isDeleted:true})

    //set body to null
    patch.set({
        body:[{children:[{text:"[DELETED CONTENTS]"}], type:"paragraph"}],
    })

    patch.set({title:"[DELETED POST]"})

    const result = await patch.commit()

    if(result){
        //delete image from post
        //wait for 1 second
        await new Promise((resolve)=>setTimeout(resolve, 1000));
        console.log("Deleting image form post");
        if(post.image?.asset?._ref){
            await adminClient.delete(post.image.asset._ref)
        }
    }

    return {success:"Post deleted successfully"}


}