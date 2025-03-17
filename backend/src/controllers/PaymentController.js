import axios from 'axios'

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

const Payment = async (req, res) => {
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
                metadata: { orderId: "12345" },
            },
            {
                headers: {
                    Authorization: `Bearer ${YOCO_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("The response from yoco is ", response.data);
        const isTransactionSuccessful = await verifyTransaction(response.data.id);
        console.log("This is the ", isTransactionSuccessful);

        return res.status(200).json(response.data)
    }
    catch (error) {
        res.status(500).json({ error: "[PAYMENT ERROR] payment controller" });
    }
}




export default Payment