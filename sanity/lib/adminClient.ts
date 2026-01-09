import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";
import baseUrl from "@/lib/baseUrl";

export const adminClient = createClient({
    projectId,
    dataset, 
    apiVersion, 
    useCdn:true, 
    stega:{
        studioUrl:`${baseUrl}/studio`
    },
    token:process.env.SANITY_ADMIN_API_TOKEN,
})