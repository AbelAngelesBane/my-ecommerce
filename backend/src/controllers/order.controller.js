 import { Product } from "../models/product.model.js";
import {Order} from "../models/order.model.js"
import { Review } from "../models/review.models.js";

import mongoose from "mongoose";

export async function createOrder(req, res) {
    // 1. Start a Session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = req.user;
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ error: "No order items" });
        }

        // 2. Stock Validation (Passing the session)
        for (const item of orderItems) {
            const product = await Product.findById(item.product).session(session);
            
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ error: `Product ${item.product} not found` });
            }
            
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }
        }

        // 3. Create Order (Passing the session)
        const [order] = await Order.create([{
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice
        }], { session });

        // 4. Update Stock (Passing the session)
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product, 
                { $inc: { stock: -item.quantity } },
                { session, new: true }
            );
        }

        // 5. Commit everything to the database
        await session.commitTransaction();
        
        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        // 6. If ANY step fails or server crashes, undo everything
        await session.abortTransaction();
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: "Internal server error - Order aborted" });
    } finally {
        // 7. Always close the session
        session.endSession();
    }
}

export async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({clerkId: req.clerkId})
            .populate("orderItems.product")
            .sort({createdAt:-1});

        const orderIds = orders.map(order => order._id);
        const reviews = await Review.find({orderId: {$in: orderIds}});
        const reviewedOrderIds = new Set(reviews.map((review) => review.orderId.toString()))

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
                    return {
                        //...takes all the fields from order and spreads them
                        ...order.toObject(),
                        //double bang operator, if null or undefined then false, else true
                        hasReviewed: reviewedOrderIds.has(order._id.toString()),
                    };
                })
            )

        res.status(200).json({orders: ordersWithReviewStatus});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});     
    }
}