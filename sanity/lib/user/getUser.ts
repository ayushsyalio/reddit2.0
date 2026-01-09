import { sanityFetch } from "../live";
import { defineQuery } from "next-sanity";
import {addUser} from "./addUser"
import { currentUser } from "@clerk/nextjs/server";


interface UserResult{
    _id:string;
    username:string;
    imageUrl:string;
    email:string;
}

const parseUsername = (username:string)=>{
    //Remove whitespace and convert to camelcase with random number to avoid conflict
    const randomNum = Math.floor(1000 + Math.random()*9000) 

    return (
        username
        .replace(/\s+(.)/g,(_,char)=>char.toUpperCase())
        .replace(/\s+/g,"")+randomNum
    )

}

export async function getUser():Promise<UserResult | {error:string}>{
    try {
        console.log("Getting current user from clerk")
        const loggedInUser = await currentUser();

        if(!loggedInUser){
            console.log("No user logged in")
            return {error:"User not found"}
        }

        console.log(`Found Clerk user:${loggedInUser.id}`)

        const getExistingUserQuery = defineQuery(`*[_type == "user" && _id == $id][0]`)

        console.log("checking if user exist in sanity database")
        const existingUser = await sanityFetch({
            query:getExistingUserQuery,
            params:{id:loggedInUser.id},
        })

        if(existingUser.data?.id){
            console.log(`User found in the database with ID:${existingUser.data._id}`)
            const user = {
                _id:existingUser.data._id,
                username:existingUser.data.username!,
                imageUrl:existingUser.data.imageUrl!,
                email:existingUser.data.email,
            }
            return user;
        }

        console.log("User not found in database, creating new user")
        const newUser = await addUser({
            id:loggedInUser.id,
            username:parseUsername(loggedInUser.fullName!),
            email:loggedInUser.primaryEmailAddress?.emailAddress ||loggedInUser.emailAddresses[0].emailAddress,
            imageUrl:loggedInUser.imageUrl,

        })

        console.log(`New user created with ID: ${newUser._id}`)
        const user = {
            _id:newUser._id,
            username:newUser.username!,
            imageUrl:newUser.imageUrl,
            email:newUser.email,
        }
        return user;

        
    } catch (error) {
        console.error("Error getting user:", error);
        return { error: error instanceof Error ? error.message : String(error) };
    }

}