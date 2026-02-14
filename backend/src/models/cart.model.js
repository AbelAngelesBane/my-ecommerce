import {mongoose} from "mongoose"


const cartItemSchema =({
    product: {
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number, 
        min:1, 
        default:1}
    
})

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    clerkId:{
        type:String,
        required:true
    },
    items:[cartItemSchema]


},{timestamps:true})


export const Cart = new mongoose.model("Cart", cartSchema)