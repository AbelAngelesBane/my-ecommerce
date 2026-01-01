
import { Review } from "../models/review.models.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export async function getProductReviews(req, res){
    try {
        const {productId} = req.body;
        const review = await Review.find({productId});
        res.status(200).json({reviews: review});
    } catch (error) {
        return res.status(500).json({error: "Internal server error"});
    }
}
export  async function createProductReview(req, res){
    try {
        const user = req.user;
        const {productId} = req.params;
        const { orderId, rating} = req.body;

        
        //check if this order has been delivered, only then we can write reviews
        const order = await Order.findOne({
            "orderItems.product": productId,
            user:user._id,
            status:"delivered"
        });
        if(!order){
            return res.status(403).json({error:"Invalid! Product not delivered yet"})
        }

        //check if this product is already reviewed
        const hasReviewed = await Review.findOne({
            orderId: orderId,
            productId: productId,
            userId:user._id
        })

        if(hasReviewed)return res.status(403).json({error:"Already submitted a review"})
        if(!rating || rating < 1 || rating > 5)return res.status(400).json({error:"Rating must be between 1 and 5"});

        const review = await Review.create({
            productId,
            userId: user._id,
            orderId,
            rating
        });

        // review.create() calls the .save() already
        //update the product rating
        const product = await Product.findById({productId});
        if (!product) {
           return res.status(404).json({ error: "Product not found" });
       }
        const reviews = await Review.find({productId});
        const totalrating =  reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.averageRating = totalrating / reviews.length;
        product.totalReviews = reviews.length;
        
        await product.save();

        res.status(200).json({message:"Review added",review});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}