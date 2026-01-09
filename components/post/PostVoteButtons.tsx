"use client";

import { downVote } from "@/action/downVote";
import { upvote } from "@/action/upvote";
import { cn } from "@/lib/utils";
import {
  GetPostVotesQueryResult,
  GetUserPostVoteQueryResult,
} from "@/sanity.types";
import { useUser } from "@clerk/nextjs";
import { ArrowDown, ArrowUp } from "lucide-react";
import { startTransition, useState, useTransition } from "react";

export default function PostVoteButtons({
  contentId,
  votes,
  vote,
  contentType = "post",
}: {
  contentId: string;
  votes: GetPostVotesQueryResult;
  vote: GetUserPostVoteQueryResult;
  contentType?: "post" | "comment";
}) {
  const { user, isSignedIn } = useUser();
  const [isPending, transition] = useTransition();
  const [optimisticvote, setOptimisticvote] =
    useState<GetUserPostVoteQueryResult>(vote);
  const [optimisticScore, setOptimisticScore] = useState<number>(
    votes.netScore
  );

  const handleUpvote = ()=>{
    if(!isSignedIn || isPending) return;

    //calculate score change, based on current vote status
    let scoreChange = 0;

    if(optimisticvote==="upvote"){
      //user is cancelling their upvote
      scoreChange = -1;
      setOptimisticvote(null)

      
    }else if(optimisticvote ==="downvote"){
      //user is changing from downvote to upvote (+2 because we remove downvote and add upvote)
      scoreChange = 2;
      setOptimisticvote("upvote")
    }else{
      //user is adding a upvote
      scoreChange=1;
      setOptimisticvote("upvote")
    }

    setOptimisticScore((prev)=>prev+scoreChange);

    startTransition(async ()=>{
      try {
        await upvote(contentId, contentType)
        
      } catch (error) {
        setOptimisticvote(vote)
        setOptimisticScore(votes.netScore)
        console.error(`Failed to upvote ${contentType}`, error)
        
      }
    })

  }

  const handleDownVote = ()=>{
    if(!isSignedIn || isPending) return;

    let scoreChange = 0;
    if(optimisticvote ==="downvote"){
      scoreChange = 1
      setOptimisticvote(null)
    }else if(optimisticvote==="upvote"){
      scoreChange = -2;
      setOptimisticvote("downvote")
    }else{
      scoreChange = -1;
      setOptimisticvote("downvote")
    }
    setOptimisticScore((prev)=>prev+scoreChange)

    startTransition(async ()=>{
      try {
        await downVote(contentId, contentType)
      } catch (error) {
        setOptimisticvote(vote)
        setOptimisticScore(votes.netScore)
        console.error(`Failed to downvote ${contentType}`, error)
      }
    })

  }

  return (
    <div className="flex flex-col items-center bg-gray-50 p-2 rounded-l-md">
      <button
      disabled={!isSignedIn || isPending || !user}
      onClick={handleUpvote}
      className={cn("p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed",optimisticvote =="upvote" ? "bg-orange-100":"hover:bg-gray-100", isPending ? "opacity-50 cursor-not-allowed":"")}
      >
        <ArrowUp
        className={cn("w-5 h-5", optimisticvote ==="upvote" ? "text-orange-500 font-bold" : "text-gray-400 hover:text-orange-500")}
        />

      </button>

      <span className="text-sm font-medium text-gray-900">
        {optimisticScore}
      </span>

      <button
      disabled={!isSignedIn || isPending || !user}
      onClick={handleDownVote}
      className={cn("p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed", optimisticvote === "downvote" ? "bg-blue-100 ": "hover:bg-gray-100", isPending ? "opacity-50 cursor-not-allowed":"")}
      >
        <ArrowDown
        className={cn("w-5 h-5", optimisticvote==="downvote" ? "text-blue-500 font-bold":"text-gray-400 hover:text-blue-500")}
        />

      </button>

    </div>
  )
  
}
