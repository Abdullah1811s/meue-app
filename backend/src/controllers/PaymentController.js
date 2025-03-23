import axios from 'axios'
import crypto from 'crypto';
import usersModel from '../models/users.model.js';
const YOCO_API_URL = process.env.YOCO_API_URL;
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
async function verifyTransaction(checkoutId) {
    try {
        const response = await axios.get(
            `https://api.yoco.com/v1/checkouts/${checkoutId}`,
            {
                headers: {
                    Authorization: `Bearer ${YOCO_SECRET_KEY}`,
                },
            }
        );

        const transaction = response.data;
        console.log("Transaction Response:", transaction);

        return transaction.status === "successful";
    } catch (error) {
        console.error("Error checking transaction status:", error.response?.data || error.message);
        return false;
    }
}

export const Payment = async (req, res) => {
    try {


        const { amount, currency, id } = req.body;
        console.log(req.body)
        const response = await axios.post(
            YOCO_API_URL,
            {
                amount,
                currency,
                cancelUrl: `${FRONTEND_URL}/users/${id}/cancel`,
                successUrl: `${FRONTEND_URL}/users/${id}/success`,
                failureUrl: `${FRONTEND_URL}/users/failure`,
                metadata: { orderId: id }, // Need to add user ID too
            },
            {
                headers: {
                    Authorization: `Bearer ${YOCO_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("The response from yoco is ", response.data);

        return res.status(200).json(response.data)
    }
    catch (error) {
        res.status(500).json({ error: "[PAYMENT ERROR] payment controller" });
    }
}

export const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-webhook-signature'];
        const rawBody = req.body.toString();
        const secret = process.env.YOCO_WEBHOOK_SECRET;

        const computedSignature = crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        if (signature !== computedSignature) {
            console.error('Invalid webhook signature');
            return res.status(401).send('Invalid signature');
        }
        console.log('Webhook verified');

        const event = JSON.parse(rawBody);

        if (event.type === 'payment.succeeded') {
            const userId = event.data.metadata.userId;
            const paymentId = event.data.id;
            const updatedUserStatus = await usersModel.findOneAndUpdate(
                { _id: userId },  
                { $set: { isPaid: true } }, 
                { new: true }  
            );

            console.log(`Payment ${paymentId} succeeded for user ${userId} and the updated user is ${updatedUserStatus}`);
        }

        res.status(200).send('Webhook processed');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send('Webhook error');
    }
};