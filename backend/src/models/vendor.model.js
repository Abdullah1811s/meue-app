import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const VendorSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      unique: true, 
      required: true, 
      trim: true, 
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone: { 
      type: String, 
      required: true, 
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"]
    },
    address: { type: String, required: true, trim: true },
    offerings: { 
      type: [String], 
      required: true,
      validate: {
        validator: function(value) {
          return value.length > 0;
        },
        message: "Offerings cannot be empty"
      }
    },
    status: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending" 
    },
    role: { type: String, default: "vendor" },
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
  },
  { timestamps: true }
);


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
