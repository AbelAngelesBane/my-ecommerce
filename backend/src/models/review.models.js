import {mongoose} from "mongoose"

const reviewSchema = mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
},{timestamps:true})

export const Review = mongoose.model("Review", reviewSchema)