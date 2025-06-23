import axios from 'axios'
import crypto from 'crypto';
import usersModel from '../models/users.model.js';
import { addUserToInvisibleRaffles } from './RaffController.js'
import schedule from 'node-schedule';
import mongoose from 'mongoose'
const YOCO_API_URL = process.env.YOCO_API_URL;
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const {
  ENTITY_ID: entityId,
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  MERCHANT_ID: merchantId,
  DOMAIN: allowlistedDomain,
  AUTHENTICATION_ENDPOINT: authenticationEndpoint,
  CHECKOUT_ENDPOINT: checkoutEndpoint,

} = process.env;

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
        successUrl: `${FRONTEND_URL}/users/${id}`,
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


    if (event.type === "payment.succeeded") {
      try {
        // Extract critical payment data safely
        const userId = event?.payload?.metadata?.userId;
        const paymentId = event?.id;
        const amount = event?.payload?.amount;

        // Validate required fields
        if (!userId || !paymentId || !amount) {
          console.error("Missing payment metadata:", { event, userId, amount, paymentId });
          return res.status(400).send("Invalid payment data");
        }

        // Validate userId as a MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          console.error("Invalid userId:", userId);
          return res.status(400).send("Invalid user ID");
        }

        const id = new mongoose.Types.ObjectId(userId);

        // Determine user type based on amount
        let userType;
        let entries;
        let updateFields = { isPaid: true };

        if (amount === 5000) {
          userType = "R50";
          entries = 10;
        } else if (amount === 1000) {
          userType = "R10";
          entries = 1;
          updateFields.R10UserPaidDate = new Date();
        } else {
          console.error("Unexpected payment amount:", amount);
          return res.status(400).send("Invalid payment amount");
        }

        updateFields.userType = userType;


        // Update user payment status
        const updatedUser = await usersModel.findOneAndUpdate(
          { _id: id },
          { $set: updateFields },
          { new: true }
        );

        if (!updatedUser) {
          console.error(`User not found: ${userId}`);
          return res.status(404).send("User not found");
        }

        console.log(`Payment processed | User: ${updatedUser} | Type: ${userType}`); //check if the updated user contain all field (userType and R10UserPaidDate only for R10 user) if yes then check waiting page since the console log only work on deployed site cuz yoco sending web hook to deployed
        try {
          const updatedRaffles = await addUserToInvisibleRaffles(id, entries);
          console.log(`Raffle entries added | Count: ${updatedRaffles.length}`);
        } catch (raffleError) {
          console.error("Raffle entry failed:", raffleError);
        }


        const againPayTime = new Date(Date.now() + 60 * 60 * 1000);

        schedule.scheduleJob(againPayTime, async () => {
          try {
            const user = await usersModel.findById(id);
            if (user && user.userType === "R10") {
              await usersModel.findOneAndUpdate(
                { _id: id },
                { $set: { isPaid: false } }
              );
              console.log(`Payment status reset for R10 User: ${id.toString()}`);
            }
          } catch (err) {
            console.error(`Failed to reset payment status for User: ${id.toString()}`, err);
          }
        });

      } catch (processingError) {
        console.error("Payment processing failed:", processingError, event);
        return res.status(500).send("Payment processing error");
      }
    }

    console.log("=> Webhook processed")
    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Webhook error');
  }
};

//=============================helper function for peach payment========================================

//getting access token
const getAccessToken = async () => {
  try {
    const response = await axios.post(authenticationEndpoint, {
      clientId,
      clientSecret,
      merchantId,
    }, {
      headers: { "Content-Type": "application/json" },
    });


    return response.data.access_token;
  } catch (error) {
    console.error("Failed to get access token:", error.response?.data || error.message);
    throw new Error("Access token fetch failed");
  }
};


//getting checkout id
const getCheckoutId = async (accessToken, userId, amount) => {
  try {
    const response = await axios.post(`${checkoutEndpoint}/v2/checkout`, {
      authentication: { entityId },
      amount: amount,
      currency: "ZAR",
      shopperResultUrl: `${allowlistedDomain}/api/payment/payment-result/${userId}`,
      notificationUrl: `${allowlistedDomain}/api/payment/webhookPeach`,
      merchantTransactionId: `ORDER-${Date.now()}`,
      nonce: `${Math.floor(Math.random() * 1000000)}`,
      customParameters: { userId },
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Origin: allowlistedDomain,
        Referer: allowlistedDomain,
      },
    });


    return {
      checkoutId: response.data.checkoutId,
      redirectUrl: response.data.redirectUrl
    };

  } catch (error) {
    console.error("❌ Failed to get checkout ID:", error.response?.data || error.message);
    throw new Error("Checkout ID fetch failed");
  }
};


export const peachPayment = async (req, res) => {
  try {
    const { id, amount } = req.body;
    if (!id) return res.status(400).json({ message: "Missing userId" });

    const token = await getAccessToken();
    const { checkoutId, redirectUrl } = await getCheckoutId(token, id, amount);
    res.status(200).json({ redirectUrl });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
}


export const handleWebhookPeach = async (req, res) => {
  try {
    const data = req.body;
    const body = req.body;
    console.log(body)
    if (body.verificationCode) {
      console.log("Verification webhook received:", body);
      res.status(200).send("Verification OK");
    }
    console.log("Webhook data received:", data);

    const amount = data.amount;
    const userId = data.customParameters?.userId || "unknown";
    const resultCode = data["result.code"];
    const status = data["result.description"];

    console.log("Parsed Webhook:");
    console.log("Amount:", amount);
    console.log("User ID:", userId);
    console.log("Result Code:", resultCode);
    console.log("Status:", status);

    if (resultCode === "000.100.110") {
      console.log(`Payment verified for user ${userId}`);

    
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid MongoDB ObjectId for userId:", userId);
        return res.status(400).send("Invalid user ID");
      }

      const id = new mongoose.Types.ObjectId(userId);
      console.log("🆔 Converted userId to ObjectId:", id.toString());

   
      let userType;
      let entries;
      let updateFields = { isPaid: true };

      if (Number(amount) === 50.00) {
        userType = "R50";
        entries = 10;
        console.log("R50 payment");
      } else if (Number(amount) === 10.00) {
        userType = "R10";
        entries = 1;
        updateFields.R10UserPaidDate = new Date();
        console.log("R10 payment");
      } else {
        console.error("Unrecognized payment amount:", amount);
        return res.status(400).send("Invalid payment amount");
      }

      updateFields.userType = userType;
      
      // Update user document
      const updatedUser = await usersModel.findOneAndUpdate(
        { _id: id },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        console.error(`No user found in DB with ID: ${userId}`);
        return res.status(404).send("User not found");
      }

      console.log(`MongoDB user updated: ${updatedUser.email} (${updatedUser._id})`);

      try {
        const updatedRaffles = await addUserToInvisibleRaffles(id, entries);
        console.log(` ${entries} raffle entries added for user ${userId} →`, updatedRaffles);
      } catch (raffleError) {
        console.error("Failed to add raffle entries:", raffleError);
      }

      // Schedule isPaid reset for R10 users
      if (userType === "R10") {
        const againPayTime = new Date(Date.now() + 60 * 60 * 1000);
        console.log("R10 isPaid reset at:", againPayTime.toISOString());

        schedule.scheduleJob(againPayTime, async () => {
          try {
            const user = await usersModel.findById(id);
            if (user && user.userType === "R10") {
              await usersModel.findOneAndUpdate(
                { _id: id },
                { $set: { isPaid: false } }
              );
              console.log(`R10 payment status reset for user ${id.toString()}`);
            }
          } catch (err) {
            console.error(`Error resetting R10 isPaid for user ${id.toString()}`, err);
          }
        });
      }

    } else {
      console.log("Payment resultCode not successful:", resultCode);
    }

    res.status(200).send("Webhook processed");
  } catch (error) {
    console.error("Webhook error (Peach):", error);
    res.status(400).send("Webhook error");
  }
};


export const handlePaymentResult = async (req, res) => {
  const data = req.body;
  const { userId } = req.params;
  const resultCode = data["result.code"];


  if (resultCode?.startsWith("000.000") || resultCode?.startsWith("000.100")) {
    res.redirect(`${FRONTEND_URL}/users/${userId}`);
  } else {
    res.redirect(`${FRONTEND_URL}/users/${userId}/cancel`);
  }
};



