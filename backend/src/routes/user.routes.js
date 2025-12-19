import { Router } from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress, addToWishList, removeFromWishList, getWishList } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

//app.use(protectRoute)

router.post("/addresses",protectRoute,addAddress);
router.get("/addresses",protectRoute,getAddresses);
router.put("/addresses/:addressId", protectRoute, updateAddress);
router.delete("/addresses/:addressesId", protectRoute,  deleteAddress)


//wishList
router.get("/wishlist", addToWishList);
router.delete("/wishlist/:productId", removeFromWishList);
router.get("/wishlist", getWishList);
export default router;