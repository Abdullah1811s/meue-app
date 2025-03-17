import express from 'express'
import { createAdmin, removeAdmin, createSuperAdmin } from '../controllers/adminController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
import { Login } from '../controllers/authController.js';
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.post('/loginAdmin',RateLimiter , Login);
router.post('/createAdmin', authenticate, authorization(["admin"]), createAdmin)
router.post("/createSuperAdmin", authenticate, authorization(["admin"]), createSuperAdmin);
router.delete('/removeAdmin', authenticate, authorization(["admin"]), removeAdmin)



export default router;