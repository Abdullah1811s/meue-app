import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
    {
        referrerModel: {
            type: String,
            required: true,
            enum: ["Affiliate", "User"],
        },
        referrer: { type: mongoose.Schema.Types.ObjectId, refPath: "referrerModel", required: true },
        referredUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        referralCode: { type: String, required: true },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
        commissionEarned: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Referral", referralSchema);
