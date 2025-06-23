import express from 'express'
import { Payment, handleWebhookPeach, peachPayment, handlePaymentResult } from '../controllers/PaymentController.js';
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
//route for yoco payment
router.post('/checkout', authenticate, authorization(["user"]), Payment);

//route for peach payment
router.post('/checkout/peach', authenticate, authorization(["user"]), peachPayment);
router.post("/webhookPeach", express.urlencoded({ extended: true }), handleWebhookPeach);
router.post("/payment-result/:userId", express.urlencoded({ extended: true }), handlePaymentResult);
export default router;