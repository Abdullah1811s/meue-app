import vendorModel from "../models/vendor.model.js";
import usersModel from "../models/users.model.js";
import affiliateModel from "../models/affiliate.model.js";
import Admin from "../models/admin.model.js";

export const checkForExistingUser = async (req, res) => {
    const models = {
        vendorModel,
        usersModel,
        affiliateModel,
        Admin
    };

    try {
        const { email, modelName } = req.body;

        // Validate input
        if (!email || !modelName) {
            return res.status(400).json({ message: "Missing email or modelName" });
        }

        // Check if the model exists
        const Model = models[modelName];
        if (!Model) {
            return res.status(400).json({ message: "Invalid modelName" });
        }

        // Check if the user exists
        const isUser = await Model.findOne({ email });
        console.log("The user is:", isUser);

        return res.status(200).json({
            message: isUser ? "User already exists" : "User doesn't exist",
            existingUser: !!isUser,
        });
    } catch (error) {
        console.error("[ERROR CHECKING FOR EXISTING USER]", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};