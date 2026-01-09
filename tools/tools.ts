import { adminClient } from "@/sanity/lib/adminClient";
import { tool } from "ai"
import {z} from 'zod'

export const censorPost = tool({
    description:"Censor inappropriate content in post title body",
    parameters:z.object({
        postId:z.string().describe("The ID of the post to censor"),
        title:z.string().optional().describe("Censor version of the title"),
        body:z.string().optional().describe("censored version of the body"),
        isToBeReported:z.boolean().optional().describe("If the post contains prohibited content, return true, oterwise return false"),
    }),
    execute: async ({postId, title, body, isToBeReported})=>{
        if(!isToBeReported){
            console.log(`>>>>>>Post ${postId} is not reported`);
            return{
                success:true,
                message:`Post ${postId} is not reported`
            }
        }
        console.log(`>>>>>Censoring content is post ${postId}`)
        const patch = adminClient.patch(postId);

        if(title){
             console.log(`>>>>>Censoring title:${title}`)
             patch.set({title})
        }

        if(body){
            console.log(`>>>>>>Censoring body:${body}`);
            //convert body to portable text format
            const portableTextBody = [
                {
                    _type:"block",
                    _key:Date.now().toString(),
                    children:[
                        {
                            _type:"span",
                            _key:Date.now().toString + "1",
                            text:body,
                        }
                    ]
                }
            ];
            patch.set({body:portableTextBody});
        }
        if(isToBeReported){
            console.log(`>>>>>Reporting post ${postId}`);
            patch.set({isReported:true});
        }
        await patch.commit();
        return {
            postId,
            censored:true,
            message:"Content has been reported"
        };
    },
   
});


export const reportUser = tool({
    description:"Report a user for violating the community guidelines",
    parameters:z.object({
        userId:z.string().describe("The ID of the user to report"),
    }),
    execute:async ({userId})=>{
        console.log(`>>>>>Reporting User ${userId}`);
        const patch = adminClient.patch(userId)
        patch.set({isReported:true})
        await patch.commit();
        console.log("User reported succesfully")

        return {
            success:true,
            message:`User ${userId} reported succesfully.`
        }
    }
})