import affiliateModel from "../models/affiliate.model.js";
import { CheckEmailAndPh } from "../utils/checkEmailandPhone.js";
import jwt from "jsonwebtoken";
import { generateReferralCode } from "../utils/generateReferralCode.js";
import { sendEmail } from "../utils/emailService.js"; // Import email function
import referralModel from "../models/referral.model.js";

export const getAffiliateById = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const affiliate = await affiliateModel.findOne({ email });

        if (!affiliate) {
            return res.status(404).json({ message: "Affiliate not found for this email" });
        }

        res.status(200).json({ message: "Affiliate found successfully", data: affiliate });
    } catch (error) {
        console.error("[AFFILIATE SERVER ERROR]", error);
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error: error.message });
    }
};

export const registerAffiliate = async (req, res) => {
    try {
        const { fullName, surname, email, phoneNumber, type, businessName, companyRegistrationNumber, vatNumber, tradingAddress, provinceCity, businessContactNumber, businessEmailAddress, password, promotionChannels, socialMediaPlatforms, otherPromotionMethod, targetAudience } = req.body;

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
            referralCode
        });
       
        
        res.status(201).json({ message: "Affiliate registered successfully" });
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
        console.log("Password match:", isMatch);
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


export const removeAffiliateById = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const affiliate = await affiliateModel.findOne({ _id: id });
        if (!affiliate) {
            return res.status(404).json({ message: "Affiliate with this id not found" });
        }


        await affiliateModel.findOneAndDelete({ _id: id });

        res.status(200).json({ message: "Affiliate removed successfully" });
    } catch (error) {
        console.error("[AFFILIATE SERVER ERROR]", error);
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error: error.message });
    }

};


export const updateStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Affiliate ID is required" });
        }
        const affiliate = await affiliateModel.findByIdAndUpdate(
            { _id: id },
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
                <p>The referral code is ${affiliate.referralCode}</p>
                <p>Best regards, <br> The Menu Team</p>
            `;

            const emailSent = await sendEmail(affiliate.email, subject, "Your affiliate status has been approved.", message);

            if (!emailSent.success) {
                return res.status(500).json({ message: "Status updated, but email failed to send." });
            }
        }

        if (status === "rejected") {
            const subject = "Your Affiliate Application Status";
            const message = `
                <p>Dear ${affiliate.fullname},</p>
                <p>We appreciate your interest in our affiliate program. Unfortunately, after careful review, we regret to inform you that your application has been <strong>rejected</strong>.</p>
                <p>We encourage you to apply again in the future or reach out if you have any questions.</p>
                <p>Best regards, <br> The Menu Team</p>
            `;

            const emailSent = await sendEmail(affiliate.email, subject, "Your affiliate application was not approved.", message);

            if (!emailSent.success) {
                return res.status(500).json({ message: "Status updated, but email failed to send." });
            }
        }

        res.status(200).json({ message: "Status updated successfully", affiliate });
    } catch (error) {
        console.error("[AFFILIATE SERVER ERROR] updateStatus", error);
        res.status(500).json({ message: "[AFFILIATE SERVER ERROR]", error: error.message });
    }
};
