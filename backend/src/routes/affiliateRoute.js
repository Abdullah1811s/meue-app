import express from 'express'
import { getAllAffiliates, getAffiliateById, loginAffiliate, registerAffiliate, updateStatus, removeAffiliateById } from '../controllers/affiliatedController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.get("/", getAllAffiliates);
router.get("/get", getAffiliateById);
router.post("/login", RateLimiter, loginAffiliate);
router.post("/register", RateLimiter,registerAffiliate);
router.put("/updateStatus", authenticate, authorization(["admin"]), updateStatus);
router.delete("/removeAffiliate", authenticate, authorization(["admin"]), removeAffiliateById);
export default router;