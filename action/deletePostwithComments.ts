'use server';

import { client } from "@/sanity.client";

export async function deletePostWithComments(postId: string) {
  // 1. Fetch all comments
  const comments = await client.fetch(
    `*[_type == "comment" && post._ref == $postId]{ _id }`,
    { postId }
  );

  // 2. Delete comments first
  const transaction = client.transaction();

  comments.forEach((c: { _id: string }) => {
    transaction.delete(c._id);
  });

  // 3. Delete post
  transaction.delete(postId);

  await transaction.commit();
}
