import { Cart } from "../models/cart.model.js";
export async function runMigration(req, res) {
    try {
        const result = await Cart.updateMany(
        {}, 
        { $rename: { "items.$[].productId": "items.$[].product" } }
        );
        console.log(`Successfully migrated ${result.modifiedCount} carts.`);
    } catch (error) {
        console.error("Migration failed:", error);
    }
}