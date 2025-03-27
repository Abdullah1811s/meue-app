import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Name is required"], trim: true },
        email: {
            type: String, required: [true, "Email is required"],
            unique: true, lowercase: true, trim: true,
            match: [/.+@.+\..+/, "Please enter a valid email"]
        },
        phone: {
            type: String, required: [true, "Phone number is required"],
            unique: true, minlength: [10, "Phone number must be at least 10 digits"],
            match: [/^\d+$/, "Phone number must contain only digits"]
        },
        password: {
            type: String, required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            validate: {
                validator: function (value) {
                    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
                },
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            },
        },
        role: { type: String, default: "user" },
        TotalPoints: { type: Number, default: 0 },  // Points system
        DailyLoginPoint: { type: Number, default: 0 },  // Points system
        wheelRotatePoint: { type: Number, default: 0 },  // Points system
        signupPoint: { type: Number, default: 0 },  // Points system
        ReferralPoint: { type: Number, default: 0 },
        dailyLoginDate: { type: Date }, // Track last login for daily points
        city: { type: String, required: true, trim: true },
        province: { type: String, required: true, trim: true },
        street: { type: String, required: true, trim: true },
        signupDate:
        {
            type: Date,
            default: Date.now,
        },
        town: { type: String, required: true, trim: true },
        userType: {
            type: String,
            enum: ["R50", "R10"],
         
        },
        R10UserPaidDate:
        {
            type: Date
        },
        postalCode: { type: String, required: true, trim: true, match: [/^\d+$/, "Postal code must contain only digits"] },
        isPaid: { type: Boolean, default: false },
        prizeWon: { type: String },
        referralCodeShare: { type: String },
        numberOfTimesWheelRotate: { type: Number, default: 0 }
    },
    { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {

        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
