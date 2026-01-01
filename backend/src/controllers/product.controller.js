

import { Product } from "../models/product.model.js"

export async function getProducts(req,res){
    try {
        const limit = req.query.limit || 10;
        const skip = req.query.skip || 0;    
        const products = await Product.find({}).sort({createdAt: -1}).skip(skip).limit(limit);
    
        res.status(200).json({ items: products.length,products})
    } catch (error) {
       return res.status(500).json({error: "Internal server error"})
    }

}

export async function getProduct(req, res){
    try {
        const {id} = req.params;        
        const product = await Product.findById(id);
        if(!product)return res.status(404).json({error:"Product Not found"});
        res.status(200).json({product})
    } catch (error) {
        return res.status(500).json({error: "Internal server error"})
    }
}

export async function getProductsByCategory(req, res){
    try {
        const {category} = req.params;
        const limit = req.query.limit || 10;
        const skip = req.query.skip || 0;       

        if(!category) return res.status(400).json({error: "Please provide a category"});
        const products = await Product.find({category:category}).sort({createdAt: -1}).skip(skip).limit(limit);
        if(!products || products.length === 0)return res.status(200).json({message: "No product found in this category"});

        res.status(200).json({products});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"})
    }
}