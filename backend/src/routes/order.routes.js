import {Router} from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";

const router = Router();

router.use(protectRoute);
router.get("/",getUserOrders);
router.post("/", createOrder);


export default router;