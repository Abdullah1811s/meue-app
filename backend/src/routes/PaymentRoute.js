import express from 'express'
import {Payment, handleWebhook} from '../controllers/PaymentController.js';
import {authenticate , authorization} from '../middlewares/authMiddleware.js'
const router = express.Router();
router.post('/checkout', authenticate, authorization(["user"]), Payment);
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

export default router;