"use client"

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function CreatePost(){
    const router = useRouter();
    const pathname = usePathname();
    const {user} = useUser();

    const handleCreatePost = ()=>{
        //Extract the community name from the pathname if it follows the pattern/community/[name]
        const communityName = pathname.includes("/community/")
        ? pathname.split("/community/")[1] :null;

        //if we are in a community, redirect to the post with that community pre-selected
        if(communityName){
            router.push(`/create-post?subreadit=${communityName}`)
        }else{
            //otherwise just go to the post page
            router.push("/create-post")
        }
    }
    return (
        <Button onClick={handleCreatePost} disabled={!user} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2"/>
            {user ? "Create Post" :"Sign in to create post"}


        </Button>
    )
}