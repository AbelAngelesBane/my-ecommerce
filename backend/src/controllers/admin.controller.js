import cloudinary from "../config/cloudinary.js";
import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {User} from "../models/user.model.js"
export async function createProduct (req,res){
    
    try {
        const error = [];

        const requiredFields = ["name", "description", "price", "stock","category"]

        const fieldNames = Object.keys(req.body);

        //check if all fields are present
        console.log("Field names", fieldNames)
        requiredFields.forEach((field) => {
            if(!fieldNames.includes(field))error.push({field})
        });    
        if(error.length > 0)return res.status(400).json({error:`The following fields are required: ${error}`});
        
        const {name, description, price, stock, category} = req.body;
        
        //check if all fields are not empty
        if(!name)error.push("name")
        if(!description)error.push("description")
        if(!price)error.push("price")
        if(!stock)error.push("stock")
        if(error.length > 0)return res.status(400).json({error:`The following fields are empty: ${error}`});
        
        //check if there's an image attached 
        if(!req.files || req.files.length === 0){
            return res.status(400).json({error:"At least one image is required"});
        }

        if(req.files.length > 3){
            return res.status(400).json({error:"Maximum 3 images allowed"});
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path,{
                folder:"products"
            })
        });

        const uploadResults = await Promise.all(uploadPromises);
        //secure_url

        const imageUrls = uploadResults.map((urls) => urls.secure_url);

        const product = await Product.create({
            name:name,
            description,
            price: parseFloat(price),
            stock:parseInt(stock), 
            category,
            images: imageUrls,
        })
        res.status(200).json(product)

    } catch (error) {
        console.error("Error creating product", error.response.data);
        res.status(500).json({error:"Internal server error"});
        
    }
}

export async function getAllProducts(_, res) { //_ means not using variable
    console.log("get prod")
    try {
        const products = await Product.find({
            isArchived:{$ne:true}
        }).sort({createdAt:-1});
        res.status(200).json({items: products.length,products})
    } catch (error) {
        console.error("Error finding products", error);
        res.status(500).json({error:"Internal server error"});       
    }
}

export async function updateProduct(req, res){
    try {
        const {id} = req.params;
        const {name, description, price,stock,category} = req.body;

        if(!name && !description && !price && !stock && !category){
            return res.status(400).json({error:"At least one field is required"});
        }

        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({error:"Product not found"});
        }
        if(name) product.name = name;
        if(description) product.description = description;
        if(price !== undefined) product.price = parseFloat(price);
        if(stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;

        //handle image updates if new images are uploaded
        if(req.files && req.files.length > 0){
            if(req.files.length > 3){
                return res.status(400).json({error:"Maximum 3 images allowed"});
            }

            const uploadPromises = req.files.map((file)=>{
                return cloudinary.uploader.upload(file.path,{
                    folder:"products"
                });
            });
        const uploadResults = await Promise.all(uploadPromises);
        product.images = uploadResults.map((result) => result.secure_url);
        }

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        console.error("Error updating products", error);
        res.status(500).json({error:"Internal server error"});         
    }
}

export async function getAllOrders(req, res){
    try {
        //on the order we have the "user" field that refs User, from that user use it to get the name and email. That's how populate works 
    
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("orderItems.product")
            .sort({createdAt:-1})

        res.status(200).json({orders})
    } catch (error) {
        console.error("Error fetching products", error);
        res.status(500).json({error:"Internal server error"});   
    }
}

export async function updateOrderStatus(req, res){
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        if(!["pending", "shipped", "delivered"].includes(status)){
            return res.status(400).json({error:"Invalid Status"});
        }
        const order = await Order.findById(orderId);
        if(!order)return res.status(404).json({error: "Not found"})
        order.status = status;

        if(status === "shipped" && !order.shippedAt)order.shippedAt = new Date();
        if(status === "delivered" && !order.deliveredAt){
            order.deliveredAt = new Date();
        }
        await order.save()
        res.status(200).json({message:"Order status updated"})
    } catch (error) {
        console.error("Error updating products", error);
        res.status(500).json({error:"Internal server error"});   
    }
}

export async function getAllCustomers (_, res){
    try {
        //add pagination here later, 15 per page
        const customers =  await User.find().sort({createdAt:-1})
        if(!customers) return res.status(200).json({error:"No users found"})
        res.status(200).json(customers)
    } catch (error) {
        console.error("Error in getAllCustomers", error);
        res.status(500).json({error:"Internal server error"});  
    }
}

export async function getDashboardStats(_, res){
    try {
        const totalOrders = await Order.countDocuments();

        //aggregate
        const revenueResult = await Order.aggregate([
            {
                $group:{
                    _id:null,
                    total:{$sum: "$totalPrice"}
                }
            }
        ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({totalRevenue,totalOrders, totalCustomers, totalProducts})
    } catch (error) {
        console.error("Error in dashboard stats", error);
        res.status(500).json({error:"Internal server error"});  
    }
}

export async function archiveProduct(req, res) {
    try {
        const { productId } = req.params;

        // findByIdAndUpdate bypasses some strict schema checks if configured, 
        // but it's better to just have the schema updated.
        const product = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    isArchived: true,
                    archivedAt: new Date()
                }
            },
            { new: true } // Returns the updated document
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Successfully archived", product });
    } catch (error) {
        console.error("Archive Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function checkArchive(req, res){
    const allProductsEver = await Product.find({}).lean(); 
    console.log("Total products in DB:", allProductsEver.length);
    console.log("Archived products in DB:", allProductsEver.filter(p => p.isArchived).length);
    return res.status(200).json({allProductsEver})
}