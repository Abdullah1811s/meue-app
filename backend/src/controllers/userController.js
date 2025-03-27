import usersModel from '../models/users.model.js';
import { addPoints } from '../utils/pointsService.js'

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

export const incrementUserSpin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("coming")
    const user = await usersModel.findByIdAndUpdate(
      id,
      { $inc: { numberOfTimesWheelRotate: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    setTimeout(async () => {
      await usersModel.findByIdAndUpdate(id, { numberOfTimesWheelRotate: 0 });
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error incrementing user spin count:", error);
    return res.status(500).json({ message: "Please try again later" });
  }
};

export const updatePoint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await usersModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.ReferralPoint += 1000;
    await user.save();
    await addPoints(user._id, user.ReferralPoint);

    return res.status(200).json({ message: "Referral points updated successfully", user });
  } catch (error) {
    console.error("Error updating user points:", error);
    return res.status(500).json({ message: "Please try again later" });
  }
};