import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getSubreadits() {
  const getSubreaditsQuery = defineQuery(`*[_type == "subreadit"] {
        ...,
        "slug": slug.current,
        "moderator": moderator->,
      } | order(createdAt desc)`);

  const subreadits = await sanityFetch({ query: getSubreaditsQuery });

  return subreadits.data;
}