import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import {ENV} from "../config/env.js"

export const protectRoute = [ 
    //a list or middleware sandwhich because it need's to past multiple middleware. You can call it inside a middleware function but,
    // separating is better to specify a job.
    requireAuth(),
    async (req, res, next) =>{
        try {
            const clerkId = req.auth().userId;
            if (!clerkId)return res.status(401).json({message:"Unauthorized - invalid token"})

            const user = await User.findOne({clerkId});
            if(!user)if (!clerkId)return res.status(404).json({message:"Unauthorized - user not found"})

            req.user = user
            next();
        } catch (error) {
            console.error("Error in protectRoute middleware", error);
            res.status(500).json({message: "Internal server error"});
        }
    }
]

export const adminOnly = (req, res, next) =>{
    if(!req.user){
        return res.status(401).json({message:"Unauthorized - user not found"})
    }
    if(req.user.email !== ENV.ADMIN_EMAIL){
        return res.status(403).json({message: "Forbidden - admin access only"})
    }

    next()
}