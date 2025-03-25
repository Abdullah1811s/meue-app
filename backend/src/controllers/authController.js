import usersModel from '../models/users.model.js';
import referralModel from "../models/referral.model.js";
import Admin from '../models/admin.model.js';
import affiliateModel from "../models/affiliate.model.js";
import { generateToken } from '../utils/generateToken.js';
import { generateReferralCode } from "../utils/generateReferralCode.js";
import { addPoints } from '../utils/pointsService.js'
import axios from 'axios';


export const verifyCaptcha = async (captchaToken) => {
    try {
        if (!captchaToken) {
            throw new Error("Captcha token is missing");
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";

        const { data } = await axios.post(verificationUrl, null, {
            params: {
                secret: secretKey,
                response: captchaToken,
            },
        });

        if (!data.success) {
            throw new Error("Captcha verification failed");
        }

        return true; // ✅ Success
    } catch (error) {
        console.error("Captcha verification error:", error.message);
        return false; // ❌ Failure
    }
};


export const signUp = async (req, res) => {
    try {
        let referrer1;
        let referrer2;
        const { name, email, password, phone, referralCode, city, province, street, town, postalCode, captchaToken , userType  } = req.body;

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ message: "Captcha verification failed please reload and try again" });
        }
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

            referrer1 = await affiliateModel.findOne({ referralCode });
            referrer2 = await usersModel.findOne({ referralCodeShare: referralCode }); //increase the point of this user

            if (referrer2) {
                referrer2.ReferralPoint += 100
                await referrer2.save();
                await addPoints(referrer2._id, referrer2.ReferralPoint);
            }
            referrer = referrer1 || referrer2;

            if (referrer) {
                finalReferralCode = referrer.referralCode;
            } else {
                return res.status(400).json({ message: "Invalid referral code" });
            }
        } else {

            finalReferralCode = generateReferralCode();
        }

        const referralCodeShare = generateReferralCode();

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
            userType,
            town,
            postalCode,
            referralCodeShare
        });

        if (referrer) {

            const code = referrer.referralCodeShare || finalReferralCode;

            const newr = await referralModel.create({
                referrer: referrer._id,
                referrerModel: referrer1 ? "Affiliate" : "User",
                referredUser: newUser._id,
                referralCode: code,
                status: "pending",
            });
            if (!newr) return res.status(409).json({ message: "Can't find the code " });


        }

        // Generate token for the new user
        const tokenPayload = {
            id: newUser._id,
            name: newUser.name
        };
        const token = generateToken(tokenPayload);

        newUser.signupPoint += 125;
        newUser.save();
        await addPoints(newUser._id, newUser.signupPoint);

        /*
        here te user has been added now based 
        on  the user details like R10 or R50
        */


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

        const { email, password, captchaToken } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });
        if (!captchaToken) {
            return res.status(400).json({ success: false, message: "Captcha required" });
        }

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ message: "Captcha verification failed please reload and try again" });
        }

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
            name: user.name,
            role: user.role
        };
        const token = generateToken(tokenPayload);

        const referrals = await referralModel.find({ referrer: user._id });
        const today = new Date().setHours(0, 0, 0, 0);
        const lastLogin = user.dailyLoginDate ? new Date(user.dailyLoginDate).setHours(0, 0, 0, 0) : null;

        if (lastLogin !== today) {
            user.dailyLoginDate = new Date();
            user.DailyLoginPoint += 10
            await addPoints(user._id, user.DailyLoginPoint);
            await user.save();
        }
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
        console.log(error)
        return res.status(500).json({
            message: "Server error Please try again later",
            error: error.message
        });
    }
};
