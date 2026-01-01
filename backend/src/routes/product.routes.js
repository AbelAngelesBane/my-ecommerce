import { Router } from "express";
import { getProducts, getProduct, getProductsByCategory} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.get("/category/:category", getProductsByCategory);export default router;