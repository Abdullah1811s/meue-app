import usersModel from '../models/users.model.js';
export const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.find({}, "-password"); // Exclude password field
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await usersModel.findById(req.params.id, "-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user", error: error.message });
    }
};
