import usersModel from '../models/users.model.js';
import referralModel from "../models/referral.model.js";
import Admin from '../models/admin.model.js';
import affiliateModel from "../models/affiliate.model.js";
import { generateToken } from '../utils/generateToken.js';
import { generateReferralCode } from "../utils/generateReferralCode.js";


export const signUp = async (req, res) => {
    try {
        const { name, email, password, phone, referralCode, city, province, street, town, postalCode } = req.body;
        console.log("The data has been received from the front , ", req.body);
        if (!name || !email || !password || !phone || !town || !city || !province || !street || !postalCode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isEmailExist = await usersModel.findOne({ email });
        if (isEmailExist) {
            return res.status(409).json({ message: "Email already registered, please log in" });
        }

        const isPhoneExist = await usersModel.findOne({ phone });
        if (isPhoneExist) {
            return res.status(409).json({ message: "Phone number already registered, please use a different one" });
        }

        let finalReferralCode = referralCode;
        let referrer = null;

        if (referralCode) {
            referrer = await affiliateModel.findOne({ referralCode });
            if (referrer) {
                finalReferralCode = referrer.referralCode;

            } else {
                return res.status(400).json({ message: "Invalid referral code" });
            }
        } else {
            finalReferralCode = generateReferralCode();
        }
        const newUser = await usersModel.create({
            name,
            email,
            password,
            phone,
            role: "user",
            referralCode,
            city,
            province,
            street,
            town,
            postalCode
        });

        if (referrer) {
            const newr = await referralModel.create({
                referrer: referrer._id,
                referredUser: newUser._id,
                referralCode: finalReferralCode,
                status: "pending",
            });

        }

        // Generate token for the new user
        const tokenPayload = {
            id: newUser._id,
            name: newUser.name
        };
        const token = generateToken(tokenPayload);
        // TODO:Send OTP back to User
        return res.status(201).json({
            message: "User created successfully",
            user: { ...newUser.toObject(), password: undefined },
            token,
        });

    } catch (error) {
        console.error("Error while signing up:", error);
        return res.status(500).json({
            message: "Server error [SIGN UP CONTROLLER]",
            error: error.message,
        });
    }
};






export const Login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });

        // Check if the email belongs to an admin
        if (email.endsWith("@adminMenu.com")) {
            const admin = await Admin.findOne({ email });
            if (!admin || !(await admin.comparePassword(password))) {
                return res.status(401).json({ message: "Invalid Admin Credentials" });
            }

            const adminTokenPayload = {
                id: admin._id,
                name: admin.name || "Admin",
                role: "admin"
            };
            const adminToken = generateToken(adminTokenPayload);

            return res.status(200).json({
                message: "Admin Logged in",
                admin: {
                    ...admin.toObject(),
                    password: undefined
                },
                token: adminToken
            });
        }

        // Normal User Login
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
                referrals
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
