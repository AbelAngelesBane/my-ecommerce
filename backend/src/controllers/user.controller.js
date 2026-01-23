

import { error } from "console";
import { Product } from "../models/product.model.js";
import  {User}  from "../models/user.model.js";

export async function addAddress(req, res) {
    try {
        const {label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault} = req.body;
        if(!label || !fullName || !streetAddress || !city || !state || !zipCode || !phoneNumber || isDefault === undefined) return res.status(400).json({message:"All fields required"});
       

        const user = req.user;

        //if this is default, undefault others
        if(isDefault){
            user.addresses.forEach(addr => {addr.isDefault = false})
        }
        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault || false
        })

        await user.save();
        res.status(201).json({message:"Address added succesfully", addresses: user.addresses});
    } catch (error) {
       console.error("Error in adding address", error);
       res.status(500).json({error:"Internal Server Error"});
    }
    
}


export async function getAddresses(req, res) {
    try {
        const user = req.user;
        res.status(200).json((user.addresses)) 
    } catch (error) {
        console.error("Error fetching addresses:", error);
       res.status(500).json({ error: "Internal Server Error" });      
    }
}

export async function updateAddress(req, res) {
    try {
    const { addressId } = req.params;
    const user = req.user;

    // 1. Create an empty object for the updates
    const updates = {};
    const fields = ["label", "fullName", "streetAddress", "city", "state", "zipCode", "phoneNumber", "isDefault"];

    // 2. Only add fields to 'updates' if they exist in req.body
    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ error: "Not found" });

    // 3. Now, pass the 'updates' object to .set()
    // If 'label' wasn't in the request, it's not in 'updates', so .set() ignores it.
    address.set(updates);
    await user.save()

    res.status(200).json({message: "Address updated successfully", addresses: user.addresses})

    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteAddress(req, res) {
    try {
        const {addressId} = req.params;
        const user = req.user;

        user.addresses.pull(addressId);
        await user.save();

        res.status(200).json({message:"Address deleted successfully", addresses:user.addresses})

    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ error: "Internal Server Error" });    
    }
}

export async function addToWishList(req, res){
    try {
        const {productId} = req.body;
        const user = req.user;
        console.log(productId)

        if(user.wishlist.includes(productId)){
            return res.status(400).json({error: "Product already in wishlist"});
        }
        const product = await Product.findById(productId);
        if(!product)return res.status(404).json({error:"Product Not Found"})

        user.wishlist.push(product);
        await user.save()

        res.status(200).json({message: "Product added to wishlist", wishlist: user.wishlist});
    } catch (error) {
        console.error("Error updating wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });    
    }
};
export async function removeFromWishList(req, res){
    try {
        const user = req.user;
        const {productId} = req.params;

        if(!user.wishlist.includes(productId))return res.status(400).json("Product not in the list");

        user.wishlist.pull(productId);
        await user.save()

        res.status(200).json({wishlist:user.wishlist})
    } catch (error) {
        
    }
}

export async function getWishList(req, res){
    try {
        const wishlist = await User.findById(req.user._id).populate("wishlist")
        // if(wishlist.length === 0 || wishlist === undefined)return res.status(200).message({wishlist:0});
        const result = wishlist.wishlist ?? []
        res.status(200).json({wishlist:result});

     } catch (error) {       
        console.error("Error removing from wishlist:", error);
       res.status(500).json({ error: "Internal Server Error" });
     }
}

