import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
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
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            validate: {
                validator: function (value) {
                    return /[A-Z]/.test(value) && // At least one uppercase letter
                        /[a-z]/.test(value) && // At least one lowercase letter
                        /\d/.test(value);      // At least one number
                },
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            },
        },
        role: { type: String, default: "user" },
        referralCode: { type: String },
        city: { type: String, required: [true, "City is required"], trim: true },
        province: { type: String, required: [true, "Province is required"], trim: true },
        street: { type: String, required: [true, "Street is required"], trim: true },
        town: { type: String, required: [true, "Town is required"], trim: true },
        postalCode: { type: String, required: [true, "Postal code is required"], trim: true, match: [/^\d+$/, "Postal code must contain only digits"] },
        isPaid: { type: Boolean, default: false }
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

export default mongoose.model('User', userSchema);
