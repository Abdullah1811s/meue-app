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
                role: admin.role
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


export const signUp = async (req, res) => {
    try {
        let referrer1;
        let referrer2;
        const { name, email, password, phone, referralCode, city, province, street, town, postalCode, captchaToken } = req.body;

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
            name: newUser.name,
            role: newUser.role
        };
        const token = generateToken(tokenPayload);

        newUser.signupPoint += 125;
        newUser.save();
        await addPoints(newUser._id, newUser.signupPoint);
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "support@themenuportal.co.za",
        };
        const message = `
  <h2>You’re In! Let’s Get You Started…</h2>
  <p>Hi ${newUser.name || "there"},</p>

  <p>Welcome to <strong>The Menu</strong> – where deals, rewards, raffles, and surprises meet <em>YOU</em> right where you are.</p>

  <p>You’ve just joined South Africa’s most exciting lifestyle platform. No fluff. No loyalty tricks. Just real value, delivered daily.</p>

  <p><strong>Here’s what to do next:</strong></p>
  <ol style="padding-left: 1.2rem;">
    <li>Explore Our Partners – discover exclusive offers from vendors across the country.</li>
    <li>Spin the Wheel – your first reward could be waiting.</li>
    <li>Refer & Earn – invite friends and climb the leaderboard.</li>
    <li>Explore Your Dashboard – track raffles, offers, and unlock new perks.</li>
  </ol>

  <p>This is <strong>your world. Your way.</strong> And it just got better.</p>

  <p>
    <a href="https://themenuportal.co.za/Login" style="display: inline-block; background: #DBC166; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 10px;">
      Go and login
    </a>
  </p>

  <p>Thanks for being part of the movement.</p>

  <p>
    <strong>The Menu Team</strong><br/>
    <a href="https://www.themenuportal.co.za">www.themenuportal.co.za</a><br/>
    Support: <a href="mailto:support@themenuportal.co.za">support@themenuportal.co.za</a>
  </p>
`;


        await sendEmail(
            smtpConfig,
            newUser.email,
            "Welcome to the Menu - Your World Your Way.",
            "Your Account is Ready – Let the Excitement Begin!",
            message
        );

        return res.status(201).json({
            message: "User created successfully",
            user: { ...newUser.toObject(), password: undefined },
            token,
        });

    } catch (error) {
        console.error("Error while signing up:", error);
        return res.status(500).json({
            error: error,
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