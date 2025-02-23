import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
const affiliateSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: ["true", "Full Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        minlength: [10, "Phone number must be at least 10 digits"],
        match: [/^\d+$/, "Phone number must contain only digits"],
    },
    address: { type: String, required: true },
    agreedToTerms: {
        type: Boolean,
        required: ["true", "Agree to term and condition is required"]
    },
    marketingChannel: {
        type: String,
        required: ["True", "Enter the marketing channel"]
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
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
    offering: {
        type: String,
        required: [true, "Please describe what you are offering"],
        minlength: [10, "Description must be at least 10 characters"],
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    referralCode: { type: String, unique: true },
}, { timestamps: true })






affiliateSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
    
        next();
    } catch (error) {
        next(error);
    }
});

affiliateSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

export default mongoose.model("Affiliate", affiliateSchema);