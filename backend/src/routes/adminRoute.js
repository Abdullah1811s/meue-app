import express from 'express'
import { createAdmin, removeAdmin, createSuperAdmin  ,  getAllAdmins} from '../controllers/adminController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
import { Login } from '../controllers/authController.js';
import RateLimiter from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();
router.get('/', getAllAdmins);
router.post('/loginAdmin',RateLimiter , Login);
router.post('/createAdmin', authenticate, authorization(["superadmin"]), createAdmin)
router.post("/createSuperAdmin", createSuperAdmin);
router.delete('/removeAdmin', authenticate, authorization(["superadmin"]), removeAdmin)



export default router;