import express from "express";
import { registerVendor, getVendors, vendorLogin, getVendorById, updateVendorDetails, getALlDetails, vendorTierUpdate, delVendor, updateVendorStatus , checkVendorEmailExists , forgotPassword , resetPassword } from "../controllers/vendoronBoardController.js";
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.get("/", getVendors);
router.get('/check-email', checkVendorEmailExists);
router.post("/login", RateLimiter, vendorLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get('/allDetails', authenticate, authorization(["admin" , "superadmin"]), getALlDetails);
router.post("/register", registerVendor);
router.put("/updateStatus", authenticate, authorization(["admin" , "superadmin"]), updateVendorStatus);
router.put("/updateTier", authenticate, authorization(["admin" , "superadmin"]), vendorTierUpdate);
router.delete("/del", authenticate, authorization(["admin" , "superadmin"]), delVendor);
router.put("/update/:id", RateLimiter, updateVendorDetails);

router.get("/:id", getVendorById);


export default router;



