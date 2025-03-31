import referralModel from "../models/referral.model.js";
import affiliateModel from "../models/affiliate.model.js";
import mongoose from "mongoose";
export const getCurrentUserReferral = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new Error("User ID is required");
        }

        const user = await affiliateModel
            .findOne({ _id: userId })
            .populate("referralCode");

        if (!user)
            throw new Error("User not found");
        const { referralCode } = user;

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


export const checkAffiliateStat = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("This is teh id" , id);
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Get all referrals where the referrer is this ID
        const referrals = await referralModel.find({ referrer: id })
            .populate({
                path: 'referredUser',
                select: 'userType' 
            });
            console.log("this is the reffereal" , referrals)
        // Count total referrals
        const totalReferrals = referrals.length;
        console.log("this is the total" , totalReferrals)
        // Count R10 and R50 referred users
        let r10Count = 0;
        let r50Count = 0;
      

        referrals.forEach(ref => {
            if (ref.referredUser && ref.referredUser.userType === "R10") {
                r10Count++;
            }
            if (ref.referredUser && ref.referredUser.userType === "R50") {
                r50Count++;
            }
           
        });
        console.log("this is the total R10 and R50" , r10Count , r50Count);
        // Prepare response
        const response = {
            totalReferrals: totalReferrals,
          
            userReferrals: {
                r10Count: r10Count,
                r50Count: r50Count
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching referral stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteReferrerFromReferrals = async (referrerId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(referrerId)) {
            throw new Error("Invalid referrer ID format");
        }

        // Delete all referrals where this user is the referrer
        const result = await referralModel.deleteMany({
            referrer: referrerId
        });

        return {
            success: true,
            deletedCount: result.deletedCount,
            message: `Removed referrer from ${result.deletedCount} referral(s)`
        };
    } catch (error) {
        console.error("Error deleting referrer from referrals:", error);
        return {
            success: false,
            message: error.message || "Failed to delete referrer from referrals"
        };
    }
};