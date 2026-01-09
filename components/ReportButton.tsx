'use client'

import { reportContents } from "@/action/reportContent";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Flag } from "lucide-react";
import { useState } from "react";

interface ReportButtonProps{
    contentId:string;
}

function ReportButton({contentId}:ReportButtonProps){
    const [isReported, setisReported] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const { isSignedIn } = useUser();

    const handleReport = async ()=>{
        if(isReported || !isSignedIn || isLoading) return;
        setIsloading(true);
        //optimistically update UI
        setisReported(true);

        try {
            const response = await reportContents(contentId)
            if(response.error){
                setisReported(false)
                console.error(response.error)
            }
            
        } catch (error) {
            //if error, revert optimsitic update
            setisReported(false);
            console.error("Failed to report content", error)   
        }finally{
            setIsloading(false);
        }

    }

    return(
        <button onClick={handleReport}
        disabled={isReported || isLoading || !isSignedIn}
        className={cn("flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", isReported ? "text-red-600 dark:text-red-400": "")}
        >
            <Flag
            size={14}
            className={isReported ? "fill-red-600 dark:fill-red-400":""}
            />
            <span className="hidden md:block">
                {isReported ? "Reported" :isSignedIn ? "Report":"Sign-in to Report"}

            </span>

        </button>
    )
}

export default ReportButton