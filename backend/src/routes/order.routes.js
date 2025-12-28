import {Router} from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllOrders, createOrder } from "../controllers/admin.controller.js";

const router = Router();

router.use(protectRoute);
router.get("/",getAllOrders);
router.post("/createOrder", createOrder);


export default router;