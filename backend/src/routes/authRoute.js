import express from 'express'
import {Login , signUp  , forgotPassword , resetPassword} from "../controllers/authController.js"
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.post('/signUp', signUp); // No rate limit
router.post('/Login', RateLimiter, Login); 
router.post('/forgot-password', forgotPassword);


router.put('/reset-password/:token', resetPassword);

export default router;
