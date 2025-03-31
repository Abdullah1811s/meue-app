import affiliateModel from "../models/affiliate.model.js";
import jwt from "jsonwebtoken";
import { generateReferralCode } from "../utils/generateReferralCode.js";
import { sendEmail } from "../utils/emailService.js";
import mongoose from "mongoose";
import referralModel from "../models/referral.model.js";
import schedule from "node-schedule";
import { deleteReferrerFromReferrals } from './referralController.js'


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

        res.status(200).json({
            success: true,
            message: "Affiliate retrieved successfully",
            data: {
                affiliate,
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
        console.log("The data from frontend is", req.body);
        const existingAffiliate = await affiliateModel.findOne({ email });
        if (existingAffiliate) {
            return res.status(400).json({ message: "Affiliate with this email already exists" });
        }
        console.log("yesssssssssssssssssssssss ")
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
        console.log("this is the data that has been saved in  database : ", newAffiliate);
        const subject = "Your Affiliate Signup is Complete - Awaiting Approval ✅";
        const message = `
            <p>Dear ${newAffiliate.fullName},</p>
            <p>Thank you for signing up for our affiliate program! We have received your application and it is currently under review.</p>
            <p>Our team will assess your application and notify you once it has been approved.</p>
            <p>We appreciate your patience and look forward to having you on board.</p>
            <p>Best regards, <br> The Menu Team</p>
        `;

        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "affiliates@themenuportal.co.za",
        };

        const emailSent = await sendEmail(smtpConfig, newAffiliate.email, subject, "Your affiliate application is under review.", message);

        res.status(200).json({ message: "Affiliate registered successfully", newAffiliate });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginAffiliate = async (req, res) => {
    try {
        const { email, password } = req.body;

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

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: affiliate._id, email: affiliate.email }, process.env.JWT_SECRET, {
            expiresIn: "7h"
        });

        res.status(200).json({ message: "Login successful", token, affiliate });
    } catch (error) {
        console.error("[AFFILIATE SERVER ERROR]", error);
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error: error.message });
    }
};

export const getAllAffiliates = async (req, res) => {
    try {
        const affiliates = await affiliateModel.find();
        res.status(200).json({ message: "All affiliates fetched successfully", data: affiliates });
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

        res.status(200).json({ message: "Status updated successfully", affiliate });
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
        console.log("Deleting the referre thing from database : ", referralDeletionResult.message); // Optional logging
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
            // Add password if required
            // pass: "your-email-password"
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