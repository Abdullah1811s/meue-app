import usersModel from '../models/users.model.js';
import { addPoints } from '../utils/pointsService.js'
import { sendEmail } from '../utils/emailService.js';
import { removeUserFromAllRaffles } from './RaffController.js'


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

    // Find the user first
    const user = await usersModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is in cooldown period (after first spin but before 8 hours)
    if (user.firstSpinTime) {
      const firstSpinTime = new Date(user.firstSpinTime);
      const cooldownEnd = new Date(firstSpinTime);
      cooldownEnd.setHours(cooldownEnd.getHours() + 8);
      
      if (new Date() < cooldownEnd && user.numberOfTimesWheelRotate === 1) {
        const timeLeft = Math.ceil((cooldownEnd - new Date()) / (1000 * 60 * 60));
        return res.status(400).json({ 
          message: `Please wait ${timeLeft} more hour(s) before spinning again`,
          cooldownEnd,
          firstSpinTime: user.firstSpinTime
        });
      }
    }

    // Prepare update
    const updateFields = { $inc: { numberOfTimesWheelRotate: 1 } };
    
    // Set firstSpinTime if this is the first spin
    if (!user.firstSpinTime) {
      updateFields.$set = { firstSpinTime: new Date() };
    }

    // Update user
    const updatedUser = await usersModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    // Reset spin count after 24 hours from first spin
    if (updatedUser.numberOfTimesWheelRotate === 1) {
      setTimeout(async () => {
        await usersModel.findByIdAndUpdate(id, {
          numberOfTimesWheelRotate: 0,
          firstSpinTime: null,
        });
      }, 24 * 60 * 60 * 1000);
    }

    return res.status(200).json({ 
      user: updatedUser,
      canSpinAgain: updatedUser.numberOfTimesWheelRotate < 2
    });
  } catch (error) {
    console.error("Error incrementing user spin count:", error);
    return res.status(500).json({ 
      message: "Please try again later",
      error: error.message 
    });
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

export const delUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({ error: "please provide the user id" });
    const user = await usersModel.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({ error: "user not found" });
    await removeUserFromAllRaffles(id);
    const subject = "Your Account Has Been Removed ";
    const message = `
    <p>Dear ${user.name},</p>
    <p>We regret to inform you that your account has been removed from our system.</p>
    <p>If you believe this was done in error or have any questions, please feel free to contact our support team at <a href="mailto:support@themenuportal.co.za">support@themenuportal.co.za</a>.</p>
    <p>We appreciate your time with us and wish you all the best.</p>
    <p>Best regards, <br> The Menu Team</p>
`;

    const smtpConfig = {
      host: "mail.themenuportal.co.za",
      port: 465,
      user: "support@themenuportal.co.za",
    };

    const emailSent = await sendEmail(
      smtpConfig,
      user.email,
      subject,
      "Your account has been removed.",
      message
    );

    res.status(200).json({ message: "The user has been deleted" });
  }
  catch (error) {
    return res.status(500).json({ message: "Error in deleting user" })
  }
}
