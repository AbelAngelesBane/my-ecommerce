import {Router} from "express";
import {createProduct,archiveProduct,checkArchive,getAllProducts, updateProduct, getAllOrders, updateOrderStatus, getAllCustomers, getDashboardStats} from "../controllers/admin.controller.js"
import { adminOnly, protectRoute } from "../middlewares/auth.middleware.js";
import { upload  } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(...protectRoute, adminOnly)
router.post("/products",upload.array("images", 3),createProduct);
router.get("/products",getAllProducts);
router.put("/products/:id",upload.array("images", 3),updateProduct);
router.patch("/products/:productId/archive",archiveProduct);
router.get("/products/archive",checkArchive);

router.get("/orders",getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus)

router.get("/customers",getAllCustomers)
router.get("/stats",getDashboardStats)

//Put vs Patch: Put to update all parts of the resource, Patch for partial only
export default router
