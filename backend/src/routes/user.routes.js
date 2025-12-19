import { Router } from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress, addToWishList, removeFromWishList, getWishList } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

//app.use(protectRoute)

router.post("/addresses",protectRoute,addAddress);
router.get("/addresses",protectRoute,getAddresses);
router.put("/addresses/:addressId", protectRoute, updateAddress);
router.delete("/addresses/:addressId", protectRoute,  deleteAddress)


//wishList
router.post("/wishlist", protectRoute, addToWishList);
router.get("/wishlist", protectRoute, getWishList);
router.delete("/wishlist/:productId", protectRoute, removeFromWishList);
export default router;