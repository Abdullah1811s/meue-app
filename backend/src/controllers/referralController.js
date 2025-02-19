import referralModel from "../models/referral.model.js";
import usersModel from '../models/users.model.js';

export const getCurrentUserReferral = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new Error("User ID is required");
        }

        const user = await usersModel
            .findOne({ _id: userId })
            .populate("referralCode");

        if (!user)
            throw new Error("User not found");
        const { referralCode } = user;
        console.log(user);
        res.status(200).json({ referralCode });

    } catch (error) {
        console.error("Error fetching user referral code:", error.message);
        res.status(500).json({ error: error.message });
    }

}




export const getReferredByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const referral = await referralModel.findOne({ referredUser: userId })
            .populate("referrer", "name email");

        if (!referral) {
            return res.status(200).json({ message: "No referral record found", notFound: true });
        }


        res.status(200).json({
            message: "Referral details retrieved",
            referrer: referral.referrer,
            referralCode: referral.referralCode,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 2️⃣ Get Users Referred by the Logged-in User
export const getUserReferrals = async (req, res) => {
    try {
        const { userId } = req.params;

        const referrals = await referralModel.find({ referrer: userId })
            .populate("referredUser", "name email");

        res.status(200).json({
            message: "Referrals retrieved",
            referrals: referrals.map(r => ({
                user: r.referredUser,
                referralCode: r.referralCode,
            })),
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 3️⃣ Get Earnings (Total Commission)
export const getEarnings = async (req, res) => {
    try {
        const { userId } = req.params;

        const successfulReferrals = await referralModel.find({ referrer: userId, status: "completed" });

        const totalEarnings = successfulReferrals.reduce((acc, ref) => acc + ref.commissionEarned, 0);

        res.status(200).json({
            message: "Earnings retrieved",
            totalEarnings: `$${totalEarnings.toFixed(2)}`,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 4️⃣ Check Payout Eligibility
export const getPayoutStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const successfulReferrals = await referralModel.find({ referrer: userId, status: "completed" });

        const totalEarnings = successfulReferrals.reduce((acc, ref) => acc + ref.commissionEarned, 0);
        const payoutEligible = totalEarnings >= 20; // Example: Minimum $20 for payout

        res.status(200).json({
            message: "Payout status retrieved",
            totalEarnings: `$${totalEarnings.toFixed(2)}`,
            payoutEligible: payoutEligible,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 5️⃣ Get All Referral Codes of the Current User
export const getAllReferralCodes = async (req, res) => {
    try {
        const { userId } = req.params;

        const referrals = await referralModel.find({ referrer: userId });

        if (!referrals || referrals.length === 0) {
            return res.status(404).json({ message: "No referral codes found for this user" });
        }

        const referralCodes = referrals.map(ref => ref.referralCode);

        res.status(200).json({
            message: "Referral codes retrieved",
            referralCodes: referralCodes,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
