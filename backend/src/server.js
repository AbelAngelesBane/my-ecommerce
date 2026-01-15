import express from "express"
import path from "path"
import cors from "cors"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";
import {clerkMiddleware} from "@clerk/express";
import { serve } from "inngest/next";
import { runMigration } from "./scripts/migration.js";


import { functions, inngest } from "./config/innjest.js";

import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js"
import orderRoutes from "./routes/order.routes.js"
import reviewRoutes from "./routes/review.routes.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"

const app = express()

const __dirname = path.resolve();

app.use(express.json())

app.use(clerkMiddleware()) //You're wondering why there's an auth (req.auth) in auth.middleware, because clerkMiddleware added it here
app.use(cors({origin:ENV.CLIENT_URL, credentials:true})); //credentials true allos browser to send cookies to the server with the request

app.get("/api/health", (req, res) => {
    res.status(200).json({message:"Success"});
})
app.use("/api/inngest", serve({client:inngest, functions}))
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.put("/migration",runMigration);

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

