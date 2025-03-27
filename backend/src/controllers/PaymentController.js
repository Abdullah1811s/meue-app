import axios from 'axios'
import crypto from 'crypto';
import usersModel from '../models/users.model.js';
import { addUserToInvisibleRaffles } from './RaffController.js'

const YOCO_API_URL = process.env.YOCO_API_URL;
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;


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
                successUrl: `${FRONTEND_URL}/users/${id}`, //updated the route after payment user move to the home page
                failureUrl: `${FRONTEND_URL}/users/failure`,
                metadata: {
                    orderId: "12345",
                    userId: id
                },
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
    // 1. Get required headers and raw body
    const signatureHeader = req.headers['webhook-signature'];
    const webhookId = req.headers['webhook-id'];
    const timestamp = req.headers['webhook-timestamp'];
    const rawBody = req.body;

    // 2. Validate timestamp freshness (within 3 minutes)
    const now = Math.floor(Date.now() / 1000);
    const timeDifference = Math.abs(now - parseInt(timestamp));
    if (timeDifference > 180) {
      return res.status(401).send('Invalid timestamp');
    }

    // 3. Compute expected signature using webhook secret
    const secret = process.env.YOCO_WEBHOOK_SECRET;
    const secretKey = Buffer.from(secret.split('_')[1], 'base64');
    const signedContent = `${webhookId}.${timestamp}.${rawBody.toString()}`;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(signedContent)
      .digest('base64');

    // 4. Validate received signature against computed signature
    const signatures = signatureHeader.split(' ');
    const receivedSignature = signatures[0].split(',')[1];
    if (!crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(receivedSignature)
    )) {
      return res.status(401).send('Invalid signature');
    }

    // 5. Parse and process the webhook event
    const event = JSON.parse(rawBody.toString());
    
    if (event.type === 'payment.succeeded') {
      try {
        // Extract critical payment data with safe access
        const userId = event?.payload?.metadata?.userId;
        const paymentId = event?.id;
        const amount = event?.payload?.amount;
        const userType = amount === 5000 ? "R50" : "R10";

        // Validate required fields
        if (!userId || !paymentId || !amount) {
          console.error('Missing payment metadata:', { event, userId, amount, paymentId });
          return res.status(400).send('Invalid payment data');
        }

        console.log("Amount:", amount, "Calculated userType:", userType); 
        const updatedUser = await usersModel.findOneAndUpdate(
          { _id: userId },
          { $set: { isPaid: true, userType } },
          { new: true }
        );

        if (!updatedUser) {
          console.error(`User not found: ${userId}`);
          return res.status(404).send('User not found');
        }

        console.log(`Payment processed | User: ${userId} | Type: ${userType}`);

        // Add to invisible raffles based on user type
        const entries = userType === "R50" ? 10 : 1;
        try {
          const updatedRaffles = await addUserToInvisibleRaffles(userId, entries);
          console.log(`Raffle entries added | Count: ${updatedRaffles.length}`);
        } catch (raffleError) {
          console.error('Raffle entry failed:', raffleError);
        }

        // Schedule payment status reset for R10 users
        if (userType === "R10") {
          setTimeout(async () => {
            await usersModel.findOneAndUpdate(
              { _id: userId },
              { $set: { isPaid: false } }
            );
            console.log(`R10 access expired | User: ${userId}`);
          }, 3600000); // 1 hour
        }

      } catch (processingError) {
        console.error('Payment processing failed:', processingError, event);
        return res.status(500).send('Payment processing error');
      }
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Webhook error');
  }
};