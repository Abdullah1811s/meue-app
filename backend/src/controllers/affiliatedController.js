import affiliateModel from "../models/affiliate.model.js";
import jwt from "jsonwebtoken";
import { generateReferralCode } from "../utils/generateReferralCode.js";
import { sendEmail } from "../utils/emailService.js";
import mongoose from "mongoose";
import referralModel from "../models/referral.model.js";
import schedule from "node-schedule";
import { deleteReferrerFromReferrals } from './referralController.js'
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary'

const generateResetToken = (affiliateId) => {
    return jwt.sign(
        { id: affiliateId },
        process.env.JWT_SECRET + '-reset', // Different secret for reset tokens
        { expiresIn: '1h' } // Short-lived token
    );
};


const deleteFile = async (publicId) => {
    try {
        const fileExtension = publicId.split('.').pop().toLowerCase();
        let resourceType = "image";

        if (['pdf', 'doc', 'docx', 'txt', 'csv', 'xlsx', 'ppt'].includes(fileExtension)) {
            resourceType = "raw";
        }
        console.log("The resource type is ", resourceType);
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
            type: "upload"
        });

        console.log('Deleted:', result);
        return result;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};



export const getAffiliateById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID exists and is a valid MongoDB ID if using MongoDB
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID parameter is required",
                error: "Missing ID parameter"
            });
        }

        // If using MongoDB, validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
                error: "The provided ID is not valid"
            });
        }

        const affiliate = await affiliateModel.findById(id);
        const refCount = await referralModel.countDocuments({ referrer: id });
        console.log(`Number of referrals for affiliate ${id}:`, refCount);

        if (!affiliate) {
            return res.status(404).json({
                success: false,
                message: "Affiliate not found",
                error: `No affiliate found with ID: ${id}`
            });
        }

        const { password, resetPasswordToken, resetPasswordExpire, ...safeAffiliate } = affiliate.toObject();

        res.status(200).json({
            success: true,
            message: "Affiliate retrieved successfully",
            data: {
                affiliate: safeAffiliate,
                refCount
            }
        });


    } catch (error) {
        console.error("[AFFILIATE CONTROLLER ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while retrieving affiliate",
            error: error.message
        });
    }
};

export const registerAffiliate = async (req, res) => {
    try {
        const { fullName, surname, email, phoneNumber, type, businessName, companyRegistrationNumber, vatNumber, tradingAddress, provinceCity, businessContactNumber, businessEmailAddress, password, promotionChannels, socialMediaPlatforms, otherPromotionMethod, targetAudience, bankName,
            accountHolder,
            accountNumber,
            branchCode,
            bankConfirmationUrl,
            agreedToTerms, idNumber } = req.body;

        const existingAffiliate = await affiliateModel.findOne({ email });
        if (existingAffiliate) {
            return res.status(400).json({ message: "Affiliate with this email already exists" });
        }

        const referralCode = generateReferralCode();
        const newAffiliate = await affiliateModel.create({
            fullName,
            surname,
            email,
            phoneNumber,
            type,
            businessName: type === "business" ? businessName : null,
            companyRegistrationNumber: type === "business" ? companyRegistrationNumber : null,
            vatNumber: type === "business" ? vatNumber : null,
            tradingAddress: type === "business" ? tradingAddress : null,
            provinceCity: type === "business" ? provinceCity : null,
            businessContactNumber: type === "business" ? businessContactNumber : null,
            businessEmailAddress: type === "business" ? businessEmailAddress : null,
            password,
            promotionChannels,
            socialMediaPlatforms,
            otherPromotionMethod,
            targetAudience,
            referralCode,
            bankName,
            accountHolder,
            accountNumber,
            branchCode,
            bankConfirmationUrl,
            agreedToTerms,
            idNumber
        });

        const subject = "🎉 Welcome to The Menu Affiliate Network!";

        const message = `
  <p>Hi <b>${newAffiliate.fullName}</b>,</p>

  <p>You’re now part of <b>The Menu’s top-tier affiliate program</b>! </p>

  <p>Here’s how you win:</p>
  <ul>
    <li> Share your referral link</li>
    <li> Earn <b>30% commission</b> per user sign-up</li>
    <li> Climb the leaderboard and unlock trade promo opportunities</li>
    <li> Track everything from your Affiliate Dashboard</li>
  </ul>

 <p>
    <a href="https://themenuportal.co.za/affiliated/login" style="display: inline-block; background: #DBC166; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 10px;">
      AFFILIATE LOGIN
    </a>
  </p>

  <p>Let’s grow together </p>

  <p>Thanks for being part of the movement.</p>

  <p>Best regards,<br><b>The Menu Team</b></p>
`;

        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "affiliates@themenuportal.co.za",
        };

        const emailSent = await sendEmail(smtpConfig, newAffiliate.email, subject, "Your affiliate application is under review.", message);

        

        res.status(200).json({
            message: "Affiliate registered successfully",
           
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginAffiliate = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const affiliate = await affiliateModel.findOne({ email });
        if (!affiliate) {
            return res.status(404).json({ message: "Affiliate not found" });
        }

        // Check affiliate status
        if (affiliate.status === "pending") {
            return res.status(403).json({ message: "Your application is still under review. Please wait for approval." });
        }
        if (affiliate.status === "rejected") {
            return res.status(403).json({ message: "Your application has been rejected. You cannot log in." });
        }

        const isMatch = await affiliate.comparePassword(password);
        console.log("The pass is " , isMatch)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: affiliate._id, email: affiliate.email }, process.env.JWT_SECRET, {
            expiresIn: "7h"
        });

        res.status(200).json({ 
            message: "Login successful", 
            token, 
            affiliate: { _id: affiliate._id , status: affiliate.status }
        });
    } catch (error) {
        console.error("[AFFILIATE SERVER ERROR]", error);
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error: error.message });
    }
};

export const getAllAffiliates = async (req, res) => {
    try {
        const affiliates = await affiliateModel.find();

        const safeAffiliates = affiliates.map(affiliate => {
            const { password, ...rest } = affiliate.toObject();
            return rest;
        });

        res.status(200).json({
            message: "All affiliates fetched successfully",
            data: safeAffiliates
        });
    } catch (error) {
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error });
    }
};





export const updateStatus = async (req, res) => {
    try {
        const { id, status, reason } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Affiliate ID is required" });
        }

        const affiliate = await affiliateModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!affiliate) {
            return res.status(404).json({ message: "Affiliate not found" });
        }

        if (status === "approved") {
            const subject = "Your Affiliate Status is Approved 🎉";
            const message = `
                <p>Dear ${affiliate.fullName},</p>
                <p>We are pleased to inform you that your affiliate application has been <strong>approved</strong>.</p>
                <p>Welcome aboard! You can now start earning commissions through our program.</p>
                <p>To get started, please <a href="https://themenuportal.co.za/affiliated/login" target="_blank">log in to your account</a>.</p>
                <p>Best regards, <br> The Menu Team</p>
            `;

            const smtpConfig = {
                host: "mail.themenuportal.co.za",
                port: 465,
                user: "affiliates@themenuportal.co.za",
            };

            await sendEmail(smtpConfig, affiliate.email, subject, "Your affiliate status has been approved.", message);
        }

        if (status === "rejected") {
            const subject = "Your Affiliate Application Status";
            const message = `
                <p>Dear ${affiliate.fullName},</p>
                <p>We appreciate your interest in our affiliate program. Unfortunately, after careful review, we regret to inform you that your application has been <strong>rejected</strong>.</p>
                <p><strong>Reason for rejection:</strong> ${reason}</p>
                <p>We encourage you to apply again in the future or reach out if you have any questions.</p>
                <p>Best regards, <br> The Menu Team</p>
            `;

            const smtpConfig = {
                host: "mail.themenuportal.co.za",
                port: 465,
                user: "affiliates@themenuportal.co.za",
            };

            const emailSent = await sendEmail(
                smtpConfig,
                affiliate.email,
                subject,
                "Your affiliate application was not approved.",
                message
            );

            if (!emailSent.success) {
                return res.status(500).json({ message: "Status updated, but email failed to send." });
            }


            const deleteDate = new Date();
            deleteDate.setHours(deleteDate.getHours() + 24);

            schedule.scheduleJob(deleteDate, async () => {
                try {
                    await affiliateModel.findByIdAndDelete(id);
                    console.log(`Affiliate with ID: ${id} has been deleted after 24 hours.`);
                } catch (error) {
                    console.error("Error deleting affiliate after 24 hours:", error);
                }
            });
        }

        const { password, ...safeAffiliate } = affiliate.toObject();

        res.status(200).json({
            message: "Status updated successfully",
            affiliate: safeAffiliate
        });

    } catch (error) {
        console.error("[AFFILIATE SERVER ERROR] updateStatus", error);
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error: error.message });
    }
};


export const checkUserExists = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                data: null
            });
        }

        // Check if email is valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
                data: null
            });
        }

        // Check database for existing user
        const existingAffiliate = await affiliateModel.findOne({ email }).select('email');

        if (existingAffiliate) {
            return res.status(200).json({
                success: false,
                message: "Email already registered",
                data: { exists: true }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email not registered",
            data: { exists: false }
        });

    } catch (error) {
        console.error("Error in checkUserExists:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while checking user",
            data: null,
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};



export const removeAffiliateById = async (req, res) => {
    try {
        const { affId, reason } = req.body;

        if (!affId) {
            return res.status(400).json({ message: "id is required" });
        }

        const affiliate = await affiliateModel.findOne({ _id: affId });
        if (!affiliate) {
            return res.status(404).json({ message: "Affiliate with this id not found" });
        }
        const referralDeletionResult = await deleteReferrerFromReferrals(affId);
        if (affiliate.bankConfirmationUrl.public_id) {
            deleteFile(affiliate.bankConfirmationUrl.public_id)
        }
        await affiliateModel.findOneAndDelete({ _id: affId });
        const subject = "Your Affiliate Account Has Been Cancelled";
        const message = `
    <p>Dear ${affiliate.fullName},</p>
    
    <p>We regret to inform you that your affiliate account with The Menu Portal has been cancelled.</p>
    
    ${reason ? `
    <p><strong>Reason for cancellation:</strong><br>
    ${reason}</p>
    ` : ''}
    
    <p>As a result of this cancellation:</p>
    <ul>
        <li>You will no longer have access to your affiliate dashboard</li>
        <li>Any pending commissions will be forfeited</li>
        <li>Your referral links will no longer be active</li>
    </ul>
    
    <p>If you believe this cancellation was made in error, or if you would like to discuss this further, 
    please contact our support team at <a href="mailto:support@themenuportal.co.za">support@themenuportal.co.za</a>.</p>
    
    <p>We appreciate your past participation in our affiliate program.</p>
    
    <p>Best regards,<br>
    The Menu Team</p>
`;

        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "affiliates@themenuportal.co.za",

        };

        const emailSent = await sendEmail(
            smtpConfig,
            affiliate.email,
            subject,
            `Your affiliate account has been cancelled. ${reason ? `Reason: ${reason}` : ''}`,
            message
        );
        res.status(200).json({ message: "Affiliate removed successfully" });
    } catch (error) {
        console.error("[AFFILIATE SERVER ERROR]", error);
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error: error.message });
    }

};




export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const affiliate = await affiliateModel.findOne({ email });

        if (!affiliate) {
            // Don't reveal if affiliate doesn't exist for security
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been sent"
            });
        }

        // Generate JWT reset token
        const resetToken = generateResetToken(affiliate._id);

        // Store token hash in DB (for additional security)
        affiliate.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        affiliate.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await affiliate.save();


        const resetUrl = `${process.env.FRONTEND_URL}/affiliate/reset-password/${resetToken}`;

        // Email message
        const message = `
            <p>You requested a password reset for your affiliate account.</p>
            <p>Please click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        // Send email
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "affiliates@themenuportal.co.za",
        };

        await sendEmail(
            smtpConfig,
            affiliate.email,
            "Affiliate Password Reset Request",
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

        const affiliate = await affiliateModel.findOne({
            _id: decoded.id,
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!affiliate) {
            return res.status(400).json({
                message: "Password reset token is invalid or has expired"
            });
        }

        // Set new password
        affiliate.password = password;
        affiliate.resetPasswordToken = undefined;
        affiliate.resetPasswordExpire = undefined;

        await affiliate.save();

        // Send confirmation email
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "affiliates@themenuportal.co.za",
        };

        await sendEmail(
            smtpConfig,
            affiliate.email,
            "Affiliate Password Changed Successfully",
            "Password Update Confirmation",
            `<p>Your affiliate account password has been successfully updated.</p>
         <p>If you did not make this change, please contact support immediately.</p>`
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