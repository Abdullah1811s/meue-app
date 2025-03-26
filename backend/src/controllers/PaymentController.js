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
            const userType = event.data.amount === 5000 ? "R50" : "R10";
            const entries = userType === "R50" ? 10 : 1;
            
            
            console.log("Amount:", event.data.amount, "Calculated userType:", userType); //check this cuz on console log is not working on local the webhook is being sent on deployed server
            const updatedUserStatus = await usersModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        isPaid: true,
                        userType: userType // the user type is not being updated but the isPaid is being update 
                    }
                },
                { new: true }
            );


            console.log(`Payment ${paymentId} succeeded for user ${userId} and the updated user is ${updatedUserStatus}`);
            try {
                const updatedRaffles = await addUserToInvisibleRaffles(userId, entries);
                console.log(`User added to ${updatedRaffles.length} invisible raffles with ${entries} entries each`); //need to verify this also
            } catch (error) {
                console.error('Failed to add user to invisible raffles:', error);
            }

            if (userType === "R10") { //please take a look at this and verify if it is working (after 1 hour payment status of R10 user is change to false indicating they have to pay again)
                setTimeout(async () => {
                    await usersModel.findOneAndUpdate(
                        { _id: userId },
                        { $set: { isPaid: false } }
                    );
                    console.log(`User ${userId} R10 access expired after 1 hour.`);
                }, 60 * 60 * 1000);
            }
        }


        res.status(200).send('Webhook processed');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send('Webhook error');
    }
};