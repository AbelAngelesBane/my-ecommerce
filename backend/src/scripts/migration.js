import { Product } from "../models/product.model.js";

export async function runMigration(req, res) {
    try {
        // Find documents missing the isArchived field
        const result = await Product.updateMany(
            { isArchived: { $exists: false } }, 
            { 
                $set: { 
                    isArchived: false,
                    archivedAt: null // Initialize with null for non-archived items
                } 
            }
        );

        res.status(200).json({
            message: "Migration successful",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Migration Error:", error);
        res.status(500).json({ error: error.message });
    }
}