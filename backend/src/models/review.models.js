import {mongoose} from "mongoose"

const reviewSchema = mongoose.Schema({
    productId:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"Product",
        required:true
    },
    userId:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"User",
        required:true
    },
    orderId:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"Order",
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
},{timestamps:true})

export const Review = mongoose.model("Review", reviewSchema)