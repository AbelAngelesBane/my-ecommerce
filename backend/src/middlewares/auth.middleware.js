import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import {ENV} from "../config/env.js"

export const protectRoute = [ 
    //a list or middleware sandwhich because it need's to past multiple middleware. You can call it inside a middleware function but,
    // separating is better to specify a job.
    // requireAuth(),
    async (req, res, next) =>{
        try {
            const clerkId = "user_379mC8pwTxWHIPu0luG9G20pR3V"

            // const clerkId = req.auth().userId;
            if (!clerkId)return res.status(401).json({error:"Unauthorized - invalid token"})
            

            const user = await User.findOne({clerkId});
            if(!user)return res.status(404).json({error:"Unauthorized - user not found"})
            req.clerkId = clerkId
            req.user = user
            console.log("SUER FOUND")
            next();
        } catch (error) {
            console.error("Error in protectRoute middleware", error);
            res.status(500).json({message: "Internal server error"});
        }
        
    }
]

export const adminOnly = async (req, res, next) =>{
    try {
        if(!req.user){
            return res.status(401).json({error:"Unauthorized - user not found"})
        }
        if(req.user.email.toLowerCase() !== ENV.ADMIN_EMAIL.toLocaleLowerCase()){
            return res.status(403).json({error: "Forbidden - admin access only"})
    } 
    next()
    } catch (error) {
        return res.status(500).json({ error: "Internal server error during authorization" });
    }
   
}