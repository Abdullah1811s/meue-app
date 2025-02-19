import express from "express";
import { registerVendor, getVendors, getVendorById, updateVendorStatus, updateVendorDetails } from "../controllers/vendoronBoardController.js";
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
router.post("/register", registerVendor);
router.get("/", getVendors);
router.get("/:id", getVendorById);
router.put("/:id/status", updateVendorStatus);
router.put("/update/:id", authenticate, authorization(["vendor"]), updateVendorDetails);

export default router;
