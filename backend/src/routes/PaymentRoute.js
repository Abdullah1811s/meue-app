import express from 'express'
import Payment from '../controllers/PaymentController.js';
import {authenticate , authorization} from '../middlewares/authMiddleware.js'
const router = express.Router();
router.post('/checkout', authenticate , authorization(["user"]) ,Payment);
export default router;