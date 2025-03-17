import express from 'express'
import {Login , signUp} from "../controllers/authController.js"
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.post('/signUp', signUp); // No rate limit
router.post('/Login', RateLimiter, Login); // Rate limited

export default router;
