import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {createProductReview, getProductReviews} from "../controllers/review.controller.js";
const router = Router();


router.use(protectRoute);

router.get("/:productId",getProductReviews );
router.post("/:productId",createProductReview);

//call getProduct first, then call get review, if review exists then if front end presses the review it will call PUT/PATCH instead.
export default router;