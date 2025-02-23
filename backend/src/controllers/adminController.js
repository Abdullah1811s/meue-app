import Admin from "../models/admin.model.js";

export const createAdmin = async (req, res) => {
    try {
        const { whoMadeHimEmail, newEmail, password, name } = req.body;
        if (!whoMadeHimEmail || !newEmail || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!newEmail.endsWith("@adminMenu.com")) {
            return res.status(400).json({ message: "Email must end with @adminMenu.com" });
        }
        const whoMadeHim = await Admin.findOne({ email: whoMadeHimEmail });
        if (!whoMadeHim) {
            return res.status(403).json({ message: "Unauthorized! Creator admin not found" });
        }
        const existingAdmin = await Admin.findOne({ email: newEmail });
        if (existingAdmin) {
            return res.status(409).json({ message: "Admin with this email already exists" });
        }

        const newAdmin = await Admin.create({
            name,
            email: newEmail,
            password,
            whoMadeHim: whoMadeHim._id,
        });
        return res.status(201).json({
            message: "Admin created successfully", admin: {
                _id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                whoMadeHim: newAdmin.whoMadeHim,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error [CREATE ADMIN CONTROLLER]",
            error: error.message
        });
    }
};

export const removeAdmin = async (req, res) => {
    try {
        const { removeEmail } = req.body;
        if (!removeEmail) {
            return res.status(400).json({ message: "Email is required" });
        }
        const admin = await Admin.findOne({ email: removeEmail });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        await Admin.deleteOne({ email: removeEmail });

        return res.status(200).json({ message: "Admin removed successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Server error [REMOVE ADMIN CONTROLLER]",
            error: error.message
        });
    }
};

export const createSuperAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Ensure all fields are provided
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingSuperAdmin = await Admin.findOne({ role: "superadmin" });
        if (existingSuperAdmin) {
            return res.status(403).json({ message: "Super Admin already exists!" });
        }


        const superAdmin = await Admin.create({
            name,
            email,
            password,
            role: "superadmin",
        });



        return res.status(201).json({
            message: "Super Admin created successfully", superAdmin: {
                _id: superAdmin._id,
                email: superAdmin.email,
                role: superAdmin.role,
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error [CREATE SUPER ADMIN CONTROLLER]",
            error: error.message,
        });
    }
};

