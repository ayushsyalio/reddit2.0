'use client'

import { deleteComments } from "@/action/deleteComment";
import { deletePost } from "@/action/deletePost";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeletButtonProps{
    contentId:string;
    contentType:string;
    contentOwnerId:string;
}

function DeleteButton({
    contentId,
    contentType,
    contentOwnerId,
}:DeletButtonProps){
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {isSignedIn, user} = useUser()
    
    const handleDelete = async ()=>{
        if(isDeleting || !isSignedIn) return;
        if(window.confirm("Are you sure want to delete this?")){
            return;
        }
        setIsDeleting(true);
        setError(null);

        try {
            const response = contentType === "post" 
            ?await deletePost(contentId)
            :await deleteComments(contentId);
        } catch (error) {
            setError("Failed to delete. Please try again")
            console.error(`Failed to delete ${contentType}:`, error)   
        }finally{
            setIsDeleting(false)
        }

    }

    const isOwner = contentOwnerId === user?.id;
    if(!isOwner) return null;


  return (
    <button onClick={handleDelete}
    disabled = {isDeleting || !isSignedIn}
    className={cn("flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed")}
    aria-label={`Delete ${contentType}`}
    >
        <Trash2 size={14}/>
        <span className="hidden md:block">
            {isDeleting ? "Deleting" : isSignedIn ? "Delete" : "Sign in to delete"}

        </span>
        {error && <span className="text-red-500 ml-2">{error}</span>}


    </button>
  )
}

export default DeleteButton

