import express from "express"
import path from "path"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";
import {clerkMiddleware} from "@clerk/express";
import { serve } from "inngest/next";

import { functions, inngest } from "./config/innjest.js";

import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js"

const app = express()

const __dirname = path.resolve();

app.use(express.json())

app.use(clerkMiddleware()) //You're wondering why there's an auth (req.auth) in auth.middleware, because clerkMiddleware added it here

app.get("/api/health", (req, res) => {
    res.status(200).json({message:"Success"});
})
app.use("/api/inngest", serve({client:inngest, functions}))
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
if(ENV.NODE_ENV === "production"){
    //says both serve the react and backend
    app.use(express.static(path.join(__dirname, "../admin/dist"))); 

    //if it detects route other than API routes, then it is the react
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    })
}

const startServer = async ()=>{
    app.listen(ENV.PORT, ()=>{
        console.log("Server is up and running")
    });
    connectDB();
}
startServer();

