"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import createComment from "@/action/createComment";

export default function CommentInput({
  postId,
  parentCommentId,
}: {
  postId: string;
  parentCommentId: string;
}) {
  const [content, setContent] = useState("");
  const [isPending, startTansition] = useTransition();
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTansition(async () => { 
      try {
        const result = await createComment(
            postId,
            parentCommentId,
            content,
        );

        if(result.error){
            console.error("Error adding comment:", result.error);
        }else{
            setContent("");
            // router.refresh();
        }



      } catch (error) {
        console.error("Failed to submit comment:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
        placeholder={user ? "Add a comment..." : "Sign in, to comment"}
        disabled={isPending || !user}
      />
      <Button
        type="submit"
        variant="default"
        disabled={isPending || !user || content.length === 0}
      >
        {isPending ? "Posting comment..." : "Comment"}
      </Button>
    </form>
  );
}
