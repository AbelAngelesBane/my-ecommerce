import { error } from "console";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

//TO IMPLEMENT LATER, REMOVE ARCHIVED PRODUCTS FROM RESULT
export async function getCart(req, res) {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        const clerkId = req.user.clerkId
        const user = req.user
        if (!cart) {
            cart = await Cart.create({
                user: user._id,
                clerkId: clerkId, // Make sure  MONGOOSE SCHEMA has clerkId as a String
                items: [] // INITIALIZE with an empty array
            });

            //  A new cart won't have items to filter, so we can return early
            return res.status(200).json({ cart });
        }
        // Filter out archived products

        if (cart && cart.items) {
            cart.items = cart.items.filter(item => {
                return item.product && !item.product.isArchived
            });
            await cart.save();
        }


        //get total here
        return res.status(200).json({ cart });
    } catch (error) {
        console.log("Error in cart controller", error);
        return res.status(500).json({ error: "Internal Server Error " });
    }
}
export async function addToCart(req, res) {

    try {
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        if (product.isArchived) return res.status(400).json({ error: "Product is no longer available" });
        if (product.quantity < quantity) return res.status(400).json({ error: "Product quantity insufficient" })
        const clerkId = req.user.clerkId
        //if this product is in the cart already, only add quantity
        let cart = await Cart.findOneAndUpdate(
            {
                //items.product here is: { "product": ObjectID("ABC"), "quantity": 2 }
                user: req.user._id,
                "items.product": productId
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
                    // 1 Add the item to the array
                    $push: { items: { product, quantity } },
                    //  ONLY set these fields if a NEW document is created
                    $setOnInsert: { clerkId: clerkId } //THIS IS ALREADY IN MY FILTER BEFORE, WITH user: but codeRabbit says no
                },
                { upsert: true, new: true, runValidators: true }
            );
        }
        return res.status(200).json({ cart })

    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateCartItem(req, res) {
    //Long method 
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        if (quantity < 1) {
            return res.status(400).json({ error: "Quantity must be atleast 1" });
        }

        const cart = await Cart.findOne({ user: user._id }).populate("items.product");
        if (!cart) return res.status(400).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex((item) => item.product._id.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

        //validate product and stock
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        if (product.isArchived) return res.status(400).json({ error: "Product is no longer available" });
        //remove product from cart if quantity is zero

        if (product.stock < quantity) return res.status(404).json({ error: "Insufficient stock" });

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({ cart })

    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function clearCart(req, res) {
    try {
        const user = req.user._id;

        const cart = await Cart.updateOne(
            { user: user },
            { $set: { items: [] } },
            { new: true }
        );
        res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function removeFromCart(req, res) {
    try {
        const user = req.user;
        const { productId } = req.params;
        let cart = await Cart.findOne({ user: user._id });
        if (!cart) return res.status(400).json({ error: "Cart doesnt exist or empty" });
        //filter method  
        cart.items = cart.items.filter((item) => item.product.toString() !== productId
        );
        await cart.save()
        return res.status(200).json({ cart })


    } catch (error) {
        console.log("Error in cart controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}