import { error } from "console";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";


export async function getCart(req, res) {
    try {
        let cart = await Cart.findOne({user: req.user._id}).populate("items.product");

        //but honetsly, I'd just handle this in the frontend
        if(!cart){
            const user = req.user;

            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items:[]
            });
        }
        //get total here
        return res.status(200).json({cart});
    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({error:"Internal Server Error"});
    }
}
export async function addToCart(req,res){

    try {
        const {productId, quantity = 1} = req.body;
        const product = await Product.findOne({productId});
        if(!product)res.status(404).json({error:"Product not found"});
        if(product.quantity < quantity)return res.status(400).json({error:"Product quantity insufficient"})
        //if this product is in the cart already, only add quantity
        let cart = await Cart.findOneAndUpdate(
            { 
                user: req.user._id, 
                "items.productId": product._id 
            },
            { 
            // The '$' tells Mongo to update the specific item that matched the query
            $inc: { "items.$.quantity": quantity } 
            },
        { new: true }
        );

        //if cart does not return then append
        if (!cart) {
            cart = await Cart.findOneAndUpdate(
                { user: req.user._id },
                { 
                $push: { 
                    items: { productId, quantity, name, price, image } 
                    } 
                },
                { upsert: true, new: true } // upsert: true creates the cart if it doesn't exist
            );
        }
        return res.status(200).json({cart})

    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export async function updateCartItem(req, res){
    //Long method 
    try {
        const {productId} = req.params;
        const {quantity} = req.body;

        if(quantity < 1){
            return res.status(400).json({error:"Quantity must be atleast 1"});
        }

        const cart = await Cart.findOne({user:user._id});
        if(!cart)return res.status(400).json({error:"Cart not found"});

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if(itemIndex === -1)return res.status(404).json({error: "Item not found in cart"});

        //validate product and stock
        const product = await Product.findById({productId});
        if(!product)return res.status(404).json({error: "Product not found"});
        if(product.stock < quantity) res.status(404).json({error: "Insufficient stock"});

        cart.items[itemIndex].quantity = quantity;
        await cart.save(); 

        res.status(200).json({cart})

    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({error:"Internal Server Error"});   
    }
}

export async function clearCart(req, res){
    try {
        const user = req.user._id;
        const cart = await Cart.findOne({user:user});
        await cart.updateOne(
            {$set: {items:[]}}
        );
        return res.status(200).json({message:"Cart cleared", cart});

    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({error:"Internal Server Error"});     
    }
}

export async function removeFromCart(req, res) {
    try {
        const user = req.user;
        const {productId} = req.params;
        let cart = await Cart.findOne({user:user._id});
        if(!cart)return res.status(400).json({error:"Cart doesnt exist or empty"});
        const product = await Product.findById(productId);
        //filter method  
        cart = await cart.items.filter((item) => {
            item.product.toString() !== productId
        });
        await cart.save()
        // //check if product still exist
        // if(!product)return res.status(400).json({error:"Product doesnt exist"});
        // const index =  cart.items.findIndex((item) => item.productId.toString() === productId);
        // //check if product exists in cart
        // if(index === -1)return res.status(400).json({error:"Product doesnt exist in cart"});
        // cart = await cart.updateOne(
        //     {user: user._id},
        //     [{
        //         $set:{
        //             items:{
        //                 $concatArrays:[
        //                     {$slice:["$items", index]},
        //                     {$slice:["$items", {$add:[index, 1]},{ $size: "$items" } ]}
        //                 ]
        //             }
        //         }
        //     }]
        // );

        return res.status(200).json({cart})
        

    } catch (error) {
         console.log("Error in cart controller");
        return res.status(500).json({error:"Internal Server Error"});            
    }
}