import express from 'express'
import { createAdmin, removeAdmin, createSuperAdmin } from '../controllers/adminController.js'
import { updateStatus, removeAffiliateById } from '../controllers/affiliatedController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
import { Login } from '../controllers/authController.js';
const router = express.Router();
router.post('/loginAdmin', Login);
router.post('/createAdmin', createAdmin)
router.post("/createSuperAdmin", createSuperAdmin);
router.delete('/removeAdmin', removeAdmin)
router.put("/updateStatus", authenticate, authorization(["admin"]), updateStatus);
router.delete("/removeAffiliate", authenticate, authorization(["admin"]), removeAffiliateById);

export default router;