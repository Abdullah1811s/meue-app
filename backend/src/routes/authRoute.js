import express from 'express'
import {Login , signUp} from "../controllers/authController.js"
import raffRateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.post('/signUp', signUp); // No rate limit
router.post('/Login', raffRateLimiter, Login); // Rate limited

export default router;
