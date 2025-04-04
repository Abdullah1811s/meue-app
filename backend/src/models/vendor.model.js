import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const VendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  companyRegNumber: { type: String, required: true },
  vatNumber: { type: String },
  tradingAddress: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  businessContactNumber: { type: String, required: true },
  businessEmail: { type: String, required: true, unique: true },
  websiteUrl: { type: String },

  socialMediaHandles: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    tiktok: { type: String }
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  representativeName: { type: String, required: true },
  representativePosition: { type: String, required: true },
  representativeEmail: { type: String, required: true },
  representativePhone: { type: String, required: true },
  businessDescription: { type: String },

  // Updated to match frontend structure
  wheelOffer: {
    type: {
      type: String,

    },
    terms: {
      type: String,

    },
    offerings: [
      {
        name: {
          type: String,

        },
        quantity: {
          type: Number
        },
        endDate: {
          type: Date
        }
      }
    ]
  },

  raffleOffer: {
    type: {
      type: String,

    },
    terms: {
      type: String,

    },
    offerings: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number
        },
        endDate: {
          type: Date
        }
      }
    ]
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

  vendorTier: {
    type: String,
    enum: ["bronze", "silver", "gold"],
    default: "bronze"
  },

  agreedToTerms: { type: Boolean, required: true },


  companyRegistrationCertificateURl: {
    public_id: { type: String },
    secure_url: { type: String }
  },

  vendorIdURl: {
    public_id: { type: String },
    secure_url: { type: String }
  },

  addressProofURl: {
    public_id: { type: String },
    secure_url: { type: String }
  },

  confirmationLetterURl: {
    public_id: { type: String },
    secure_url: { type: String }
  },

  businessPromotionalMaterialURl: {
    public_id: { type: String },
    secure_url: { type: String }
  },

  referralCodeUsed: { type: String },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save hook for password hashing
VendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add method for password comparison
VendorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update the timestamp on document update
VendorSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Vendor", VendorSchema);