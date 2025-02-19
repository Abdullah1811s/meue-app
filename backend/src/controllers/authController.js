import usersModel from '../models/users.model.js';
import referralModel from "../models/referral.model.js";
import { generateToken } from '../utils/generateToken.js';
import { generateReferralCode } from "../utils/generateReferralCode.js";



export const signUp = async (req, res) => {
    try {
        const { name, email, password, phone, referralCode } = req.body;
        console.log("Received Request Body:", req.body);

        // Check for required fields
        if (!name || !email || !password || !phone)
            return res.status(400).json({ message: "All fields are required" });

        // Check if email already exists
        const isEmailExist = await usersModel.findOne({ email });
        if (isEmailExist) {
            return res.status(409).json({ message: "Email already registered, please log in" });
        }

        // Check if phone number already exists
        const isPhoneExist = await usersModel.findOne({ phone });
        if (isPhoneExist) {
            return res.status(409).json({ message: "Phone number already registered, please use a different one" });
        }

        // Generate new referral code
        const newReferralCode = generateReferralCode();
        console.log("Generated Referral Code:", newReferralCode);

        // Create the new user
        const newUser = await usersModel.create({
            name,
            email,
            password,
            phone,
            role: "user",
            referralCode: newReferralCode,
        });

        // Handle referral code logic
        if (referralCode) {
            // If referral code is provided, validate the referrer
            const referrer = await usersModel.findOne({ referralCode });

            if (!referrer) {
                return res.status(400).json({ message: "Invalid referral code" });
            }

            console.log("Referrer found:", referrer);

            // Create a referral record
            await referralModel.create({
                referrer: referrer._id,
                referredUser: newUser._id,
                referralCode,
                status: "pending",
            });
        } else {
            // No referral code provided, so no referral relationship is established
            console.log("No referral code provided");
        }

        // Generate JWT token
        const tokenPayload = {
            id: newUser._id,
            name: newUser.name
        };
        const token = generateToken(tokenPayload);

        return res.status(201).json({
            message: "User created successfully",
            user: { ...newUser.toObject(), password: undefined }, // Don't send password in the response
            token,
        });

    } catch (error) {
        console.error("Error while signing up:", error);
        return res.status(500).json({
            message: "Server error [SIGN UP CONTROLLER]",
            error: error.message,
        });
    }
}



export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const user = await usersModel.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: "Email or Password is wrong" });
        const tokenPayload = {
            id: user._id,
            name: user.name
        };
        const token = generateToken(tokenPayload);
        const referrals = await referralModel.find({ referrer: user._id });
        return res.status(200).json({
            message: "User Logged in",
            user: {
                ...user.toObject(),
                password: undefined, 
                referralCode: user.referralCode,
                referrals, 
            },
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error [LOGIN CONTROLLER]",
            error: error.message
        });
    }
};
