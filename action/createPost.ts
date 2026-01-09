'use server'

import { Post } from "@/sanity.types";
import { adminClient } from "@/sanity/lib/adminClient";
import { getSubreaditbySlug } from "@/sanity/lib/subreadits/getSubreaditbySlug";
import { getUser } from "@/sanity/lib/user/getUser";
import { auth } from "@clerk/nextjs/server";
import { CoreMessage, generateText } from "ai";
import {createClerkToolkit} from '@clerk/agent-toolkit/ai-sdk'
import {openai} from '@ai-sdk/openai'
import {censorPost, reportUser} from '../tools/tools'
import { systemPrompt } from "@/tools/prompts";

export type PostImageData = {
  base64: string;
  filename: string;
  contentType: string;
} | null;

export async function createPost({
  title,
  subreaditSlug,
  body,
  imageBase64,
  imageFilename,
  imageContentType,
}: {
  title: string;
  subreaditSlug: string;
  body?: string;
  imageBase64?: string | null;
  imageFilename?: string | null;
  imageContentType?: string | null;
}) {
  try {
    console.log("Starting post creation process");
    if (!title || !subreaditSlug) {
      console.log("Missing required fields:title or subreaditSlug");
      return { error: "Title and subreaditSlug are required" };
    }

    console.log(
      `Creating post with title : "${title}" in subreadit: "${subreaditSlug}"`
    );

    const user = await getUser();
    if ("error" in user) {
      console.log("User authentication error", user.error);
      return { error: user.error };
    }
    console.log("User authenticated:", user._id);

    //find the subreadit document by name
    console.log(`Lookin up subreadit with slug:"${subreaditSlug}"`);
    const subreadit = await getSubreaditbySlug(subreaditSlug.toLowerCase());

    if (!subreadit?._id) {
      console.log(`subreadit "${subreaditSlug}" not found`);
      return { error: `Subreadit "${subreaditSlug}" not found` };
    }
    console.log(`found subreadit:"${subreadit._id}"`);

    //perpare image data if provided
    let imageAsset;
    if (imageBase64 && imageFilename && imageContentType) {
      console.log(`Image provided :${imageFilename} ${imageContentType}`);
      console.log(`Image base64 length:${imageBase64.length} characters`);
      try {
        console.log("Processing image data...");
        //extract base64 data (remove data:image/jpeg;base64, part)
        const base64Data = imageBase64.split(",")[1];
        console.log(`Extracted base64 data(${base64Data.length} characters)`);

        //convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");

        //upload to sanity
        imageAsset = await adminClient.assets.upload("image", buffer, {
          filename: imageFilename,
          contentType: imageContentType,
        });
        console.log(`Image uploaded successfully with ID:${imageAsset._id}`);
      } catch (error) {
        console.error("Error uploading image", error);
        console.log("Will continue post creation without image");
        //continue if image upload fails
      }
    } else {
      console.log("No image was provided with post");
    }

    //create the post
    console.log("Perparing post document");
    const postDoc: Partial<Post> = {
      _type: "post",
      title,
      body: body
        ? [
            {
              _type: "block",
              _key: Date.now().toString(),
              children: [
                {
                  _type: "span",
                  _key: Date.now().toString() + "1",
                  text: body,
                },
              ],
            },
          ]
        : undefined,
      author: {
        _type: "reference",
        _ref: user._id,
      },
      subreadit: {
        _type: "reference",
        _ref: subreadit._id,
      },
      publishedAt: new Date().toISOString(),
    };

    //add image if available
    if (imageAsset) {
      console.log(`Adding image reference to post:${imageAsset._id}`);
      postDoc.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }
    console.log("Creating post in sanity database");
    const post = await adminClient.create(postDoc as Post);
    console.log(`Post created successfully with ID: ${post._id}`);

    //call the content moderation APIs
    //---- MOD STEP -----
    console.log("Starting content moderation process")
    const messages:CoreMessage[] = [
      {
        role:"user",
        content:`I posted this post  -> Post ID:${post._id}\nTitle:${title}\nBody:${body}`,
      }
    ];

    console.log("Prepared messages for morderation:", JSON.stringify(messages));
    try {
      const authContext = await auth.protect();

      const toolkit = await createClerkToolkit({authContext})
      const result = await generateText({
        model:openai("gpt-4.1-mini"),
        messages:messages as CoreMessage[],
        //conditionally inject session claims if we have auth context
        system:toolkit.injectSessionClaims(systemPrompt),
        tools:{
          ...toolkit.users(),
          censorPost,
          reportUser,
        },
      })
      console.log("AI moderation completed succesfully: ",result)
      
    } catch (error) {
      console.error("Error in content moderation:", error);
      //Don't fail the whole post creation if moderation fails
      console.log("continuing without content moderation")
      
    }

    // ---- END MOD STEP -----

    return { post };
  } catch (error) {
    console.error("Error creating post:", error)
    return {error:"Failed to create post"}
  }
}
