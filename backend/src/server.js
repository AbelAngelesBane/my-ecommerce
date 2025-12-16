import express from "express"
import path from "path"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";
import {clerkMiddleware} from "@clerk/express"

const app = express()

const __dirname = path.resolve();

app.use(clerkMiddleware())

app.get("/api/health", (req, res) => {
    res.status(200).json({message:"Success"});
})


if(ENV.NODE_ENV === "production"){
    //says both serve the react and backend
    app.use(express.static(path.join(__dirname, "../admin/dist"))); 

    //if it detects route other than API routes, then it is the react
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    })
}

app.listen(ENV.PORT, ()=> {
    console.log("Server is up and running 12");
    connectDB();
});

