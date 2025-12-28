import {Router} from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllOrders } from "../controllers/admin.controller.js";

const router = Router();

router.use(protectRoute)
router.get("/",getAllOrders);

export default router;