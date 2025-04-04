import express from 'express'
import { getAllAffiliates, getAffiliateById, loginAffiliate, registerAffiliate, updateStatus, removeAffiliateById, checkUserExists , forgotPassword , resetPassword } from '../controllers/affiliatedController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.get("/", getAllAffiliates);
router.post('/checkEmail', checkUserExists);
router.post("/login", RateLimiter, loginAffiliate);
router.post("/register", RateLimiter, registerAffiliate);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/get/:id", getAffiliateById);
router.put("/updateStatus", authenticate, authorization(["admin" , "superadmin"]), updateStatus);
router.delete("/removeAffiliate", authenticate, authorization(["admin" , "superadmin"]), removeAffiliateById);
export default router;