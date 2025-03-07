import raffModel from "../models/raff.model.js";
import { ScheduleRaff } from '../utils/generateSchedule.js'
import usersModel from "../models/users.model.js";
export const makeNewRaff = async (req, res) => {
    try {
        const { prizes, scheduledAt } = req.body;

        if (!prizes || !scheduledAt) {
            return res.status(400).json({ message: "Prizes and scheduled date are required." });
        }

        const scheduledDate = new Date(scheduledAt);

        if (isNaN(scheduledDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format. Please provide a valid date." });
        }

        if (scheduledDate < new Date()) {
            return res.status(400).json({ message: "Scheduled date cannot be in the past." });
        }

        //add all user who paid
        const paidUsers = await usersModel.find({ isPaid: true }).select('_id');
        const userIds = paidUsers.map(user => user._id);

        const newRaff = await raffModel.create({
            prizes,
            scheduledAt: scheduledDate,
            participants: userIds
        });

        ScheduleRaff(newRaff);
        return res.status(201).json({
            message: "Raffle successfully created and scheduled.",
            raffle: newRaff,
        });
    } catch (error) {
        console.error(" Error creating raffle:", error);
        return res.status(500).json({ message: "An error occurred while creating the raffle. Please try again." });
    }
};

// Get only completed Raff --> means which are done scheduling and ready to gte shown to user
export const getCompletedRaff = async (req, res) => {
    try {
        const completedReferrals = await raffModel.find({ status: "completed" });

        res.status(200).json({
            message: "Completed weekly referrals fetched successfully",
            completed: completedReferrals
        });
    } catch (error) {
        console.error("Error fetching completed referrals:", error);
        res.status(500).json({
            message: "An error occurred while fetching completed referrals",
            error: error.message
        });
    }
};

// Get only in scheduling Raff 
export const getScheduledRaff = async (req, res) => {
    try {
        const scheduledReferrals = await raffModel.find({ status: "scheduled" });

        res.status(200).json({
            message: "Scheduled weekly referrals fetched successfully",
            scheduled: scheduledReferrals
        });
    } catch (error) {
        console.error("Error fetching scheduled referrals:", error);
        res.status(500).json({
            message: "An error occurred while fetching scheduled referrals",
            error: error.message
        });
    }
};


export const updateRaffWithWinner = async (req, res) => {
    try {
        const { refId, winnerEmail } = req.body;
        if (!refId || !winnerEmail) {
            return res.status(400).json({ error: "Raffle ID and winner email are required." });
        }

        const winner = await usersModel.findOne({ email: winnerEmail });

        if (!winner) {
            return res.status(404).json({ error: "Winner not found." });
        }

        const updatedRaff = await raffModel.findByIdAndUpdate(
            { _id: refId, },
            { winner: winner._id, status: "completed" },
            { new: true }
        );

        if (!updatedRaff) {
            return res.status(404).json({ error: "Raffle not found." });
        }

        res.status(200).json({ message: "Winner updated successfully", updatedRaff });

    } catch (error) {
        console.error("Error updating raffle winner:", error);
        res.status(500).json({ error: "[ERROR IN UPDATING] week ref controller" });
    }
};

export const delRef = async (req, res) => {
    try {
        const { refId } = req.body; 

        if (!refId) {
            return res.status(400).json({ error: "Raffle ID is required." });
        }

        const deletedRaffle = await raffModel.findByIdAndDelete({_id:refId});

        if (!deletedRaffle) {
            return res.status(404).json({ error: "Raffle not found." });
        }

        res.status(200).json({ message: "Raffle deleted successfully." });

    } catch (error) {
        console.error("Error deleting raffle:", error);
        res.status(500).json({ error: "[ERROR IN DELETING] raffle controller" });
    }
};