import usersModel from '../models/users.model.js';
import referralModel from "../models/referral.model.js";
import Admin from '../models/admin.model.js';
import affiliateModel from "../models/affiliate.model.js";
import { generateToken } from '../utils/generateToken.js';
import { generateReferralCode } from "../utils/generateReferralCode.js";
import { addPoints } from '../utils/pointsService.js'
import axios from 'axios';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailService.js';

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


export const Login = async (req, res) => {
    try {
        console.log("🔹 Login request received:", req.body);

        const { email, password, captchaToken } = req.body;

        if (!email || !password) {
            console.log("❌ Missing fields:", { email, password });
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!captchaToken) {
            console.log("❌ Missing captcha token");
            return res.status(400).json({ success: false, message: "Captcha required" });
        }

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        console.log("🧩 Captcha validation result:", isCaptchaValid);

        if (!isCaptchaValid) {
            return res.status(400).json({ message: "Captcha verification failed please reload and try again" });
        }

        if (email.endsWith("@adminMenu.com")) {
            console.log("🔸 Admin login attempt:", email);
            const admin = await Admin.findOne({ email });
            console.log("Admin found:", !!admin);

            if (!admin || !(await admin.comparePassword(password))) {
                console.log("❌ Invalid admin credentials");
                return res.status(401).json({ message: "Invalid Admin Credentials" });
            }

            const adminTokenPayload = {
                id: admin._id,
                name: admin.name || "Admin",
                role: admin.role
            };
            const adminToken = generateToken(adminTokenPayload);
            console.log("✅ Admin login successful:", admin.email);

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
        console.log("👤 User login attempt:", email);
        const user = await usersModel.findOne({ email });
        console.log("User found:", !!user);

        if (!user || !(await user.comparePassword(password))) {
            console.log("❌ Invalid user credentials");
            return res.status(401).json({ message: "Email or Password is wrong" });
        }

        const tokenPayload = { id: user._id, name: user.name, role: user.role };
        const token = generateToken(tokenPayload);

        const referrals = await referralModel.find({ referrer: user._id });
        console.log(`📊 Found ${referrals.length} referrals for user`);

        const today = new Date().setHours(0, 0, 0, 0);
        const lastLogin = user.dailyLoginDate ? new Date(user.dailyLoginDate).setHours(0, 0, 0, 0) : null;

        if (lastLogin !== today) {
            console.log("🎁 Daily login points awarded");
            user.dailyLoginDate = new Date();
            user.DailyLoginPoint += 10;
            await addPoints(user._id, 10);
            await user.save();
        } else {
            console.log("🕒 Daily login points already claimed today");
        }

        console.log("✅ User login successful:", email);
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
        console.error("🔥 Error in Login:", error);
        return res.status(500).json({
            message: "Server error Please try again later",
            error: error.message
        });
    }
};


export const signUp = async (req, res) => {
    try {
        console.log("🟢 Signup request received:", req.body);

        let referrer1, referrer2;
        const { name, email, password, phone, referralCode, city, province, street, town, postalCode, captchaToken } = req.body;

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        console.log("🧩 Captcha validation result:", isCaptchaValid);

        if (!isCaptchaValid) {
            return res.status(400).json({ message: "Captcha verification failed please reload and try again" });
        }

        if (!name || !email || !password || !phone || !town || !city || !province || !street || !postalCode) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        const isEmailExist = await usersModel.findOne({ email });
        if (isEmailExist) {
            console.log("❌ Email already exists:", email);
            return res.status(409).json({ message: "Email already registered, please log in" });
        }

        let finalReferralCode = referralCode;
        let referrer = null;

        if (referralCode) {
            console.log("🔗 Referral code provided:", referralCode);
            referrer1 = await affiliateModel.findOne({ referralCode });
            referrer2 = await usersModel.findOne({ referralCodeShare: referralCode });
            console.log("Referrer found:", !!referrer1 || !!referrer2);

            if (referrer2) {
                console.log("💰 Awarding points to user referrer:", referrer2.email);
                referrer2.ReferralPoint += 100;
                await referrer2.save();
                await addPoints(referrer2._id, 100);
            }

            referrer = referrer1 || referrer2;

            if (referrer) {
                finalReferralCode = referrer.referralCode;
            } else {
                console.log("❌ Invalid referral code");
                return res.status(400).json({ message: "Invalid referral code" });
            }
        } else {
            finalReferralCode = generateReferralCode();
            console.log("🆕 Generated new referral code:", finalReferralCode);
        }

        const referralCodeShare = generateReferralCode();
        console.log("📩 User share referral code:", referralCodeShare);

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
            postalCode,
            referralCodeShare
        });

        console.log("✅ New user created:", newUser.email);

        if (referrer) {
            console.log("🔗 Creating referral record for referrer:", referrer._id);
            const code = referrer.referralCodeShare || finalReferralCode;

            const newr = await referralModel.create({
                referrer: referrer._id,
                referrerModel: referrer1 ? "Affiliate" : "User",
                referredUser: newUser._id,
                referralCode: code,
                status: "pending",
            });

            console.log("Referral record created:", newr ? newr._id : "Failed");
            if (!newr) return res.status(409).json({ message: "Can't find the code" });
        }

        const tokenPayload = { id: newUser._id, name: newUser.name, role: newUser.role };
        const token = generateToken(tokenPayload);

        newUser.signupPoint += 125;
        await addPoints(newUser._id, newUser.signupPoint);
        await newUser.save();
        console.log("🏆 Signup points awarded:", newUser.signupPoint);

        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "support@themenuportal.co.za",
        };

        console.log("📧 Sending welcome email to:", newUser.email);
        await sendEmail(
            smtpConfig,
            newUser.email,
            "Welcome to the Menu - Your World Your Way.",
            "Your Account is Ready – Let the Excitement Begin!",
            `
            <h2>The Menu Team</h2>
            <p>Hi ${newUser.name || "there"}, welcome to The Menu!</p>
            `
        );

        console.log("✅ Signup complete:", newUser.email);
        return res.status(201).json({
            message: "User created successfully",
            user: { ...newUser.toObject(), password: undefined },
            token,
        });

    } catch (error) {
        console.error("🔥 Error while signing up:", error);
        return res.status(500).json({
            error: error.message,
        });
    }
};






const generateResetToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET + '-reset', // Different secret for reset tokens
        { expiresIn: '1h' } // Short-lived token
    );
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await usersModel.findOne({ email });

        if (!user) {
            // Don't reveal if user doesn't exist for security
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been sent"
            });
        }

        // Generate JWT reset token
        const resetToken = generateResetToken(user._id);

        // Store token hash in DB (for additional security)
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save();

        // Create reset URL (use your frontend URL in production)
        // In your forgotPassword controller
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email message
        const message = `
        <p>You requested a password reset for your account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `;

        // Send email
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "support@themenuportal.co.za",
        };

        await sendEmail(
            smtpConfig,
            user.email,
            "Password Reset Request",
            "Reset your password",
            message
        );

        return res.status(200).json({
            success: true,
            message: "Password reset email sent"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            message: "Server error while processing forgot password request",
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET + '-reset');

        // Hash the token to compare with stored one
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await usersModel.findOne({
            _id: decoded.id,
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Password reset token is invalid or has expired"
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Send confirmation email
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "support@themenuportal.co.za",
        };

        await sendEmail(
            smtpConfig,
            user.email,
            "Password Changed Successfully",
            "Password Update Confirmation",
            `<p>Your password has been successfully updated.</p>`
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Reset token has expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid reset token" });
        }
        return res.status(500).json({
            message: "Server error while resetting password",
            error: error.message
        });
    }
};