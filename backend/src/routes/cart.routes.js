import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getCart, addToCart, updateCartItem, clearCart, removeFromCart } from "../controllers/cart.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getCart)
router.post("/", addToCart)
router.put("/:productId", updateCartItem)
router.delete("/", clearCart)
router.delete("/:productId", removeFromCart)

export default router;