

import { Product } from "../models/product.model.js"


export const getProducts = async (req, res) => {
  try {
    // . Extract and parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // . Execute count and find in parallel for speed
    const [products, totalItems] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit),
      Product.countDocuments()
    ]);
    //2 pages so skip ((2-1)x10) = 10 
    // . Calculate if there is a next page
    //total pages: if 2 pages > ex 22 / 10 == 2.2 ceil to 2
    const totalPages = Math.ceil(totalItems / limit);
    //2 pages is greaterThan than 2.. false
    const hasNextPage = page < totalPages;

    res.status(200).json({
      products,
      totalItems,
      currentPage: page,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

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
        let {category} = req.params;
        const limit = 10;
        const page = parseInt(req.query.page) || 1
        const skip = (page -1 ) * limit

        // const skip = req.query.skip || 0;       

        if(!category) return res.status(400).json({error: "Please provide a category"});
        category = category.toLowerCase();
        const [products, totalItems] =  await Promise.all([
            category === "all" ?  Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit) : Product.find({category:category}).sort({createdAt: -1}).skip(skip).limit(limit),
            Product.countDocuments()
        ]) 

        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages

        
        res.status(200).json({
        products,
        totalItems,
        currentPage: page,
        hasNextPage,
        nextPage: hasNextPage ? page + 1 : null
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: `Internal server error: ${error}`})
    }
}

export async function findProduct(req, res){
    try {
        const searchQuery = req.query.searchQuery
        const searchRegex = new RegExp(searchQuery, 'i');
        const products = Product.find({
            isArchived: false,
            $or:[
                {name: searchRegex },
                {description:searchRegex},
                // { _id: mongoose.Types.ObjectId.isValid(query) ? query : null } prolly in backend
            ]
        })

        res.status(200).json({products})
    } catch (error) {
        console.log("Error in product controller")
        return res.status(500).json({error: "Internal server error"})

    }
}