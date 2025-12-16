import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-ecommerce-app" });

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async({event}) => {
        await connectDB();
        const {id, email_addresses, first_name, last_name, image_url}=event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}` || "Username",
            imageUrl:image_url,
            addresses:[],
            wishList:[]
        }
        await User.create(newUser);
    }
)

const deleteUserFromDatabase = inngest.createFunction(
    {id:"delete-user-from-fb"},
    {event:"clerk/user.delete"},

    //this event is coming from clerk, as stated from the line above
    async ({event})=>{
        const {id} = event.data
        
        //delete user from db, where {clerkId is equal to id}
        await User.deleteOne({clerkId:id})
    }
)
export const functions = [syncUser, deleteUserFromDatabase]