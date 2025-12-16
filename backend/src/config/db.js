import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log(`Connected to MongoDb: ${conn.connection.host}`)
    } catch (error) {
        console.error("MONGODB connection error", error)
        process.exit(1) //1 means failure, 0 success
    }
}