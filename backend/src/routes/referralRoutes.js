import express from "express";
import {
    getReferredByUser,
    getUserReferrals,
    getEarnings,
    getAllReferralCodes,
    getPayoutStatus,
    getCurrentUserReferral
} from "../controllers/referralController.js";

const router = express.Router();

router.get("/:userId/Code", getCurrentUserReferral);
router.get("/:userId/ReferredBy", getReferredByUser);  // Who referred the user?
router.get("/:userId/referrals", getUserReferrals);  // Who has the user referred?
router.get("/:userId/earnings", getEarnings);  // How much has the user earned?
router.get("/:userId/payout", getPayoutStatus);  // Check payout status
router.get("/:userId/referral-codes", getAllReferralCodes);

export default router;
