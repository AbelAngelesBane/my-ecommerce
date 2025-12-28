import { Product } from "../models/product.model.js";
import {Order} from "../models/order.model.js"
import { Review } from "../models/review.models.js";

export async function createOrder(req, res) {
    try {
        const user = req.user;
        const {orderItems, shippingAddress, paymentResult, totalPrice} = req.body;

        if(!orderItems || orderItems.length === 0) return res.status(400).json({error: "No order items"});

        for(const item in orderItems){
            const product =  await Product.findById(item.product)
            if(!product)return res.status(404).json({error:"Product not found"})
            if(product.stock < orderItems.quantity)return res.status(400).json({error:"Insufficient stock for"})  
        }
        
        const order = await Order.create({
            user: user._id, 
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice
        });

        //increment stocks, accdg to gpt this is better para di magsabay ung transaction
        for (const item of orderItems){
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: {stock: -item.quantity},
            })
        }

        res.status(201).json({
            message:"Order created succesfully",
            order
        })
    } catch (error) {
        res.status(500).json({message:"Internal server error"});     
    }
}

export async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({clerkId: req.clerkId})
            .populate("orderItems.product")
            .sort({createdAt:-1});

            //check if each order has been reviewed
            //When you use .map() with an async function, the map doesn't wait for the database to finish. 
            // Instead, it immediately returns a Promise for every item in the array.
            //If you have 3 orders, orders.map(...) returns: [ Promise <pending>, Promise <pending>, Promise <pending> ]
            // If you try to send that to the frontend, the user will see an empty object or an error because the data hasn't actually arrived yet.
            //Think of Promise.all() as a "Manager" standing at the finish line. It takes that array of 3 pending promises and says: 
            // "I will wait until every single one of these is finished. Once they are all done, I will combine them back into an array of actual data."

            //this is decorating only.. decorating with field hasReviewed
            const ordersWithReviewStatus = await Promise.all(
                orders.map(async (order) => {
                    const review = await Review.findOne({orderId: order._id});
                    return {
                        //...takes all the fields from order and spreads them
                        ...order.toObject(),
                        //double bang operator, if null or undefined then false, else true
                        hasReviewed: !!review,
                    };
                })
            )

        res.status(200).json({orders: ordersWithReviewStatus});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});     
    }
}