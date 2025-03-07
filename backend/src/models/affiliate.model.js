import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const affiliateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  type: { type: String, enum: ["individual", "business"], required: true },
  businessName: { type: String, default: null },
  companyRegistrationNumber: { type: String, default: null },
  vatNumber: { type: String, default: null },
  tradingAddress: { type: String, default: null },
  provinceCity: { type: String, default: null },
  businessContactNumber: { type: String, default: null },
  businessEmailAddress: { type: String, default: null },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
      },
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },

  promotionChannels: [{ type: String, enum: ["Social Media", "Email Marketing", "Influencer Partnerships", "Offline Events", "Other"] }],
  socialMediaPlatforms: [{ type: String }],
  otherPromotionMethod: { type: String, default: null },
  targetAudience: { type: String, default: null },
  referralCode: { type: String }
});



affiliateSchema.pre("save", function (next) {
  if (this.type === "individual") {
    this.businessName = null;
    this.companyRegistrationNumber = null;
    this.vatNumber = null;
    this.tradingAddress = null;
    this.provinceCity = null;
    this.businessContactNumber = null;
    this.businessEmailAddress = null;
  }
  next();
});

// Middleware to hash password before saving
affiliateSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
affiliateSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


export default mongoose.model("Affiliate", affiliateSchema);