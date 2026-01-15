import { Product } from "../models/product.model.js";
export async function runMigration(req, res) {
    try {
        // $exists: false finds documents that don't even have the key yet
        const result = await Product.updateMany(
            { isArchived: { $exists: false } }, 
            { $set: { isArchived: false } }
        );

        res.status(200).json({
            message: "Migration successful",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}