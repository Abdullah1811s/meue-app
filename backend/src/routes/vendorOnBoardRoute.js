import express from "express";
import { registerVendor, getVendors, vendorLogin, getVendorById, updateVendorDetails, getALlDetails, vendorTierUpdate, delVendor, updateVendorStatus } from "../controllers/vendoronBoardController.js";
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.get("/", getVendors);
router.post("/login", RateLimiter, vendorLogin);
router.get('/allDetails', authenticate, authorization(["admin"]), getALlDetails);
router.post("/register", registerVendor);
router.put("/updateStatus", authenticate, authorization(["admin"]), updateVendorStatus);
router.put("/updateTier", authenticate, authorization(["admin"]), vendorTierUpdate);
router.delete("/del", authenticate, authorization(["admin"]), delVendor);
router.put("/update/:id", RateLimiter, updateVendorDetails);

router.get("/:id", getVendorById);


export default router;



