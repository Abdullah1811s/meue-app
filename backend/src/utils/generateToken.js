import jwt from 'jsonwebtoken';

export const generateToken = (payloadObj) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        return jwt.sign(payloadObj, process.env.JWT_SECRET, { expiresIn: "7h" });
    } catch (error) {
        console.error("Error generating token:", error.message);
        return null;
    }
};
