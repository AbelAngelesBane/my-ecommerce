import {mongoose} from "mongoose"


const cartItemSchema =({
    productId: {
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number, 
        minimum:1, 
        default:1}
    
})

const cartSchema = new mongoose.Schema({
    users:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    clerkId:{
        type:String,
        required:true
    },
    items:[cartItemSchema]


},{timeStamps:true})


export const Cart = new mongoose.model("Cart", cartSchema)