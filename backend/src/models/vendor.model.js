import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const VendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  companyRegNumber: { type: String, required: true },
  vatNumber: { type: String },
  tradingAddress: { type: String, required: true },
  province: { type: String },
  city: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  businessContactNumber: { type: String, required: true },
  businessEmail: { type: String, required: true, unique: true },
  websiteUrl: { type: String },
  socialMediaHandles: { type: Object },
  representativeName: { type: String, required: true },
  representativePosition: { type: String, required: true },
  representativeEmail: { type: String, required: true },
  representativePhone: { type: String, required: true },
  businessDescription: { type: String },
  offerings: { type: [String] },
  exclusiveOffer: {
    type: {
      type: String,
      required: true,
    },
    details: { type: String },
    terms: { type: String },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        return /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /\d/.test(value);
      },
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },
  vendorTier: { type: String, default: "bronze" },
  agreedToTerms: { type: Boolean, required: true },
  companyRegistrationCertificateURl: { type: String },
  vendorIdURl: { type: String },
  addressProofURl: { type: String },
  confirmationLetterURl: { type: String },
  businessPromotionalMaterialURl: { type: String },
});




VendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


VendorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Vendor", VendorSchema);
