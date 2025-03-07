import express from 'express'
import Payment from '../controllers/PaymentController.js';
const router = express.Router();
router.post('/checkout', Payment);
export default router;