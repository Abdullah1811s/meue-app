import express from 'express'
import { makeNewRaff, getCompletedRaff, getScheduledRaff, delRef } from '../controllers/RaffController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
router.get('/ready', getCompletedRaff)
router.get('/notRead', getScheduledRaff);
router.post('/createRaff', authenticate, authorization(["admin"]), makeNewRaff);
router.delete('/delRaff', authenticate, authorization(["admin"]), delRef);
export default router;