'use server'
import {
  GetAllPostsQueryResult,
  GetPostsforsubreaditQueryResult,
} from "@/sanity.types";
import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
import { getPostVoteStatus } from "@/sanity/lib/vote/getPostVoteStatus";
import TimeAgo from "../TimeAgo";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { MessageSquare } from "lucide-react";

import CommentInput from "../comment/CommentInput";
import CommentList from "../comment/CommentList";
import PostVoteButtons from "./PostVoteButtons";
import ReportButton from "../ReportButton";
import DeleteButton from "../DeleteButton";

interface Postprops {
  post:
    | GetAllPostsQueryResult[number]
    | GetPostsforsubreaditQueryResult[number];
  userId: string | null;
}

export default async function Post({ post, userId }: Postprops) {
  const votes = await getPostVotes(post._id);
  const vote = await getPostVoteStatus(post._id, userId);
  const comments = await getPostComments(post._id, userId || "");

  return (
    <article
      key={post._id}
      className="relative bg-white rounded-md shadow-sm border-gray-200 hover:border-gray-300 transition-colors "
    >
      <div className="flex">
        {/* vote Button */}
        <PostVoteButtons
          contentId={post._id}
          votes={votes}
          vote={vote}
          contentType="post"
        />

        {/* post content */}
        <div className="flex-1 p-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            {post.subreadit && (
              <>
                <a
                  href={`/community/${post.subreadit.slug}`}
                  className="font-medium hover:underline"
                >
                  c/{post.subreadit.title}
                </a>
                <span>•</span>
                {post.author && (
                  <a
                    href={`/u/${post.author.username}`}
                    className="hover:underline"
                  >
                    u/{post.author.username}
                  </a>
                )}
                <span>•</span>
                {post.publishedAt && (
                  <TimeAgo date={new Date(post.publishedAt)} />
                )}
              </>
            )}
          </div>
          {post.subreadit && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                {post.title}
              </h2>
            </div>
          )}
          {post.body && post.body[0]?.children?.[0]?.text && (
            <div className="prose prose-sm max-w-none text-gray-700 mb-3">
              {post.body[0].children[0].text}
            </div>
          )}

          {post.image && post.image.asset?._ref && (
            <div className="relative w-full h-64 mb-3 px-2 bg-gray-100/30">
              <Image
                src={urlFor(post.image).url()}
                alt={post.image.alt || "Post Image"}
                fill={true}
                className="object-contain rounded-md p-2"
              />
            </div>
          )}

          <button className="flex items-center px-1 py-2 gap-1 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span>{comments.length} Comments</span>
          </button>
          {/* Commentinput */}
          <CommentInput postId={post._id} parentCommentId="" />
          <CommentList
            postId={post._id}
            comments={comments}
            userId={userId || ""}
          />

          {/* commentList */}
        </div>
      </div>

      <div className="absolute top-0 right-2 p-2">
        <div className="flex items-center gap-2">
          
        <ReportButton contentId={post._id} />
        {post.author?._id && (
          <DeleteButton
          contentOwnerId={post.author?._id}
          contentId={post._id}
          contentType="post"

          />
        )}

        </div>
      </div>

      {/* Buttons */}
      
      
      
    </article>
  );
}
