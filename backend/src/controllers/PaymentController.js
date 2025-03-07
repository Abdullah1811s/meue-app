import axios from 'axios'
const Payment = async (req, res) => {
    try {
        const YOCO_API_URL = process.env.YOCO_API_URL;
        const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
        const { amount, currency } = req.body;
        console.log(req.body)
        const response = await axios.post(
            YOCO_API_URL,
            {
                amount,
                currency,
                cancelUrl: "http://localhost:5173/cancel",
                successUrl: "http://localhost:5173/success",
                failureUrl: "http://localhost:5173/failure",
                metadata: { orderId: "12345" },
            },
            {
                headers: {
                    Authorization: `Bearer ${YOCO_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response)
        res.status(200).json(response.data)
    }
    catch (error) {
        res.status(500).json({ error: "[PAYMENT ERROR] payment controller" });
    }
}
export default Payment