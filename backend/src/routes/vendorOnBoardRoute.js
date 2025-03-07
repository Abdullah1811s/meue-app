import express from "express";
import { registerVendor, getVendors, vendorLogin, getVendorById, updateVendorDetails, getALlDetails, updateVendorStatus } from "../controllers/vendoronBoardController.js";
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
router.get("/", getVendors);
router.get('/allDetails', authenticate, authorization(["admin"]), getALlDetails);
router.post("/register", registerVendor);
router.post("/login", vendorLogin);
router.put("/updateStatus", authenticate, authorization(["admin"]), updateVendorStatus);
router.get("/:id", getVendorById);
router.put("/:id/status", updateVendorStatus);
router.put("/update/:id", authenticate, authorization(["vendor"]), updateVendorDetails);

export default router;
