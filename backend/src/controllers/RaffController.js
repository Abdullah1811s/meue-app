import raffModel from "../models/raff.model.js";
import usersModel from "../models/users.model.js";
import vendorModel from "../models/vendor.model.js";
import { sendEmail } from "../utils/emailService.js";
import mongoose from "mongoose";


export const getAllRaff = async (req, res) => {
    try {
        // Populate both participants and winner
        const allRaffles = await raffModel.find()
            .populate('participants.user')
            .populate('winner.user')
            .exec();


        res.status(200).json({
            message: "All Raff fetched successfully",
            raff: allRaffles
        });
    } catch (error) {
        console.error("Error fetching raffles:", error);
        res.status(500).json({
            message: "An internal error occurred while fetching raffles.",
            error: error.message
        });
    }
};

export const makeNewRaff = async (req, res) => {
    try {
        const { name, scheduleAt, prizes, vendorId } = req.body;

        if (!name || !prizes) {
            return res.status(400).json({ message: "Name, scheduled date, and prizes are required." });
        }

        if (!Array.isArray(prizes) || prizes.length === 0) {
            return res.status(400).json({ message: "Prizes must be a non-empty array." });
        }
        let scheduledDate = null
        if (scheduleAt) {

            scheduledDate = new Date(scheduleAt);

            if (isNaN(scheduledDate.getTime())) {
                return res.status(400).json({ message: "Invalid scheduled date format. Please provide a valid date." });
            }
        }



        let endDateObj = null;
        if (prizes.endDate) {
            endDateObj = new Date(endDate);
            if (isNaN(endDateObj.getTime())) {
                return res.status(400).json({ message: "Invalid end date format. Please provide a valid date." });
            }
            if (endDateObj <= scheduledDate) {
                return res.status(400).json({ message: "End date must be after the scheduled date." });
            }
        }

        if (prizes.quantity && (typeof prizes.quantity !== 'number' || prizes.quantity <= 0)) {
            return res.status(400).json({ message: "Quantity must be a positive number." });
        }

        const paidUsers = await usersModel.find({ isPaid: true });
        if (!paidUsers || paidUsers.length === 0) {
            return res.status(400).json({ message: "No paid users found to participate in the raffle." });
        }


        const R50Users = paidUsers.filter(user => user.userType === "R50");
        const R10Users = paidUsers.filter(user => user.userType === "R10");

        const participants = [];

        if (R50Users && R50Users.length > 0) {
            participants.push(...R50Users.map(user => ({ user: user._id, entries: 10 })));
        }

        const scheduledDateOnly = new Date(scheduledDate).toISOString().split("T")[0];

        if (R10Users && R10Users.length > 0) {
            R10Users.forEach(user => {
                const userSignupDateOnly = new Date(user.signupDate).toISOString().split("T")[0];
                console.log("userSignupDateOnly: ", userSignupDateOnly, "scheduledDateOnly: ", scheduledDateOnly);
                if (userSignupDateOnly === scheduledDateOnly) {

                    participants.push({ user: user._id, entries: 1 });
                }
            });
        }

        if (participants.length > 0) {
            const newRaff = await raffModel.create({
                name,
                prizes,
                scheduledAt: scheduledDate,
                participants,
                vendorId
            });

            const completeRaff = await raffModel.findById(newRaff._id)
                .populate('participants.user')
                .populate('winner.user');

            console.log("Raffle created successfully:", newRaff);

            return res.status(201).json({
                message: "Raffle successfully created and scheduled. Please reload.",
                raffle: completeRaff,
            });
        } else {
            console.log("No eligible participants to create a raffle.");
            return res.status(400).json({ message: "No eligible participants for the raffle." });
        }



    } catch (error) {
        console.error("Error creating raffle:", error);
        return res.status(500).json({
            message: "An internal error occurred while creating the raffle. Please try again later.",
            error: error.message,
        });
    }
};

export const getCompletedRaff = async (req, res) => {
    try {
        const completedReferrals = await raffModel.find({ status: "completed" })
            .populate('participants.user')
            .populate('winner.user');

        res.status(200).json({
            message: "Completed weekly referrals fetched successfully",
            completed: completedReferrals
        });
    } catch (error) {
        console.error("Error fetching completed raffles:", error);
        res.status(500).json({
            message: "An internal error occurred while fetching completed raffles.",
            error: error.message
        });
    }
};

export const getScheduledRaff = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of the day

        const scheduledReferrals = await raffModel.find({
            status: "scheduled",
            "prizes.quantity": { $gt: "0" }, // Ensures at least one prize has a quantity greater than zero
            "prizes.endDate": { $ne: today } // Ensures endDate is not today
        })
            .populate('participants.user')
            .populate('winner'); // Also populate winner (will be null for scheduled)

        res.status(200).json({
            message: "Scheduled weekly referrals fetched successfully",
            scheduled: scheduledReferrals
        });
    } catch (error) {
        console.error("Error fetching scheduled raffles:", error);
        res.status(500).json({
            message: "An internal error occurred while fetching scheduled raffles.",
            error: error.message
        });
    }
};



export const delRef = async (req, res) => {
    try {
        const { refId } = req.body;
        if (!refId) {
            return res.status(400).json({ error: "Raffle ID is required." });
        }

        const deletedRaffle = await raffModel.findByIdAndDelete(refId);
        if (!deletedRaffle) {
            return res.status(404).json({ error: "Raffle not found." });
        }

        res.status(200).json({ message: "Raffle deleted successfully." });
    } catch (error) {
        console.error("Error deleting raffle:", error);
        res.status(500).json({
            message: "An internal error occurred while deleting the raffle.",
            error: error.message
        });
    }
};

export const toggleVisibility = async (req, res, io) => {
    try {
        const { refId } = req.body;

        if (!refId) {
            return res.status(400).json({ error: "Raffle ID is required." });
        }

        const raffle = await raffModel.findById(refId);

        if (!raffle) {
            return res.status(404).json({ error: "Raffle not found." });
        }


        const updatedRaffle = await raffModel.findByIdAndUpdate(
            refId,
            { isVisible: !raffle.isVisible },
            { new: true }
        ).populate('participants.user');


        console.log("this is the raffle : ", updatedRaffle);
        io.emit("visibilityChanged", { refId: updatedRaffle._id, updatedRaffle: updatedRaffle });
        res.status(200).json({
            message: `Raffle visibility updated to ${updatedRaffle.isVisible}`,
            raffle: updatedRaffle
        });

    } catch (error) {
        console.error("Error toggling visibility of raffle:", error);
        res.status(500).json({
            message: "An internal error occurred while updating the raffle.",
            error: error.message
        });
    }
};


export const updateRaffleOfferings = async (req, res) => {
    const { id } = req.params;
    const { offerings } = req.body;



    try {
        // Validate offerings
        if (!Array.isArray(offerings) || offerings.length === 0) {
            return res.status(400).json({ message: 'Offerings array is required' });
        }

        // Find the raffle by vendorId
        const raffle = await raffModel.findOne({ vendorId: id });

        if (!raffle) {
            return res.status(404).json({ message: 'Raffle not found' });
        }

        // Update the prizes array with the new data
        offerings.forEach(offering => {
            const prizeIndex = raffle.prizes.findIndex(prize => prize.id === offering._id);
            if (prizeIndex !== -1) {
                // Update the prize with the new data
                if (offering.endDate) {
                    raffle.prizes[prizeIndex].endDate = offering.endDate;
                }
                if (offering.quantity) {
                    raffle.prizes[prizeIndex].quantity = offering.quantity;
                }
                if (offering.name) {
                    raffle.prizes[prizeIndex].name = offering.name;
                }
            }
        });

        // Save the updated raffle
        const updatedRaffle = await raffle.save();

        console.log("The raffle is ", updatedRaffle, "and the vendor id is", id);

        res.status(200).json({
            message: 'Raffle offerings updated successfully',
            data: updatedRaffle
        });

    } catch (error) {
        console.error('Error updating raffle offerings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




export async function removeUserFromAllRaffles(userId) {
    try {
        // Validate the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        console.log("This is the user", userId);
        const result = await raffModel.updateMany(
            { 'participants.user': userId },
            { $pull: { participants: { user: userId } } }
        );
        console.log("The result after deleteing user", result)
        return result;
    } catch (error) {
        console.error('Error removing user from raffles:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}



export const updateRaffWithWinner = async (req, res) => {
    try {
        console.log("========================UPDATING WINNER=====================================");
        const { refId, winnerEmail, prizeId } = req.body;
        const prizeIdObj = new mongoose.Types.ObjectId(prizeId);

        console.log("Frontend data : ", req.body);
        let isWinner = false;

        if (!refId || !winnerEmail) {
            return res.status(400).json({ error: "Raffle ID, winner email, and prize ID are required." });
        }

        const winner = await usersModel.findOne({ email: winnerEmail });
        console.log("Winner details: ", winner);
        if (!winner) {
            return res.status(404).json({ error: "Winner not found." });
        } else {
            isWinner = true;
        }

        const raffle = await raffModel.findById(refId);

        console.log("Raffle details : ", raffle);
        if (!raffle) {
            return res.status(404).json({ error: "Raffle not found." });
        }

        const prizeIndex = raffle.prizes.findIndex((prize) => prize._id.toString() === prizeIdObj.toString());

        console.log("Prize index : ", prizeIndex);
        if (prizeIndex === -1) {
            return res.status(404).json({ error: "Prize not found in the raffle." });
        }

        const prize = raffle.prizes[prizeIndex];
        console.log("Prize in raffle : ", prize);

        const today = new Date();
        if (prize.endDate && prize.endDate.toDateString() === today.toDateString()) {
            await raffModel.findByIdAndDelete(refId);
            return res.status(200).json({ message: "Raffle deleted as the end date is today." });
        }

        // Handle quantity logic
        if (prize.quantity !== undefined && prize.quantity !== null) {
            if (prize.quantity <= 0) {
                return res.status(400).json({ error: "Prize quantity is already zero." });
            }

            prize.quantity -= 1;

            if (prize.quantity === 0) {
                raffle.prizes.splice(prizeIndex, 1);
            }
        }

        // Get today's date as a string (YYYY-MM-DD)
        const todayStr = new Date().toISOString().split("T")[0];
        const prizeEndDateStr = prize.endDate ? new Date(prize.endDate).toISOString().split("T")[0] : null;

        // If no prizes left OR the end date is today, mark the raffle as completed
        if (prizeEndDateStr === todayStr) {
            raffle.status = "completed";
        }

        // **Always push a new winner, even if they have won before**
        raffle.winner.push({
            user: winner._id,
            prize: prize.name,
            isEmailSent: false
        });

        // Decrease the user's entries in the participants array
        const participantIndex = raffle.participants.findIndex(
            p => p.user.toString() === winner._id.toString()
        );

        if (participantIndex !== -1) {
            raffle.participants[participantIndex].entries = Math.max(0, raffle.participants[participantIndex].entries - 1);

            if (raffle.participants[participantIndex].entries === 0) {
                raffle.participants.splice(participantIndex, 1);
            }
        }

        const updatedRaff = await raffModel.findByIdAndUpdate(
            refId,
            {
                prizes: raffle.prizes,
                winner: raffle.winner,
                status: raffle.status,
                participants: raffle.participants
            },
            { new: true }
        ).populate("winner.user");

        if (!updatedRaff) {
            return res.status(404).json({ error: "Raffle not found." });
        }

        const vendor = await vendorModel.findOne({ _id: raffle.vendorId });

        if (vendor) {
            if (vendor.raffleOffer && vendor.raffleOffer.offerings) {
                const offerIndex = vendor.raffleOffer.offerings.findIndex(
                    (offer) => offer.name === prize.name
                );

                if (offerIndex !== -1) {
                    const offer = vendor.raffleOffer.offerings[offerIndex];

                    if (offer.quantity !== undefined && offer.quantity !== null) {
                        if (offer.quantity <= 0) {
                            return res.status(400).json({ error: "Offer quantity is already zero." });
                        }

                        offer.quantity -= 1;

                        if (offer.quantity === 0) {
                            vendor.raffleOffer.offerings.splice(offerIndex, 1);
                        }

                        const updatedVendor = await vendorModel.findByIdAndUpdate(
                            raffle.vendorId,
                            { raffleOffer: vendor.exclusiveOffer },
                            { new: true }
                        );

                        if (!updatedVendor) {
                            console.error("Failed to update vendor's exclusive offers");
                        }
                    }
                }
            }
        }

        // Handle email sending
        if (isWinner) {
            // Use atomic update to ensure email is only sent once per win
            const winnerUpdateResult = await raffModel.updateOne(
                {
                    _id: refId,
                    "winner.user": winner._id,
                    "winner.prize": prize.name,
                    "winner.isEmailSent": false
                },
                {
                    $set: { "winner.$.isEmailSent": true }
                }
            );

            if (winnerUpdateResult.modifiedCount > 0) {
                const smtpConfig = {
                    host: "mail.themenuportal.co.za",
                    port: 465,
                    user: "support@themenuportal.co.za",
                };

                console.log(`📩 Sending email to: ${winnerEmail}`);
                await usersModel.findByIdAndUpdate(
                    winner._id,
                    { $push: { prizeWon: prize.name } },
                    { new: true }
                );
                await sendEmail(
                    smtpConfig,
                        winnerEmail,
                        "🎉 Congratulations! You're a Winner!",
                        `Dear ${winnerEmail.split('@')[0]},

                        We are excited to inform you that you have won **${prize.name}!** 🎁  

                        To claim your prize, please check your email for further details.  

                        If you don't see our email in your inbox, kindly check your spam or promotions folder.  

                        Once again, congratulations! 🎉  

                        Best regards,  
                        The Menu Portal Team`,

                        `<p>Dear <b>${winnerEmail.split('@')[0]}</b>,</p>
                        <p>We are excited to inform you that you have won <b>${prize.name}!</b> 🎁</p>
                        <p>To claim your prize, please check your email for further details.</p>
                        <p>If you don't see our email in your inbox, kindly check your <b>spam</b> or <b>promotions</b> folder.</p>
                        <p>🎉 Congratulations once again!</p>
                        <p>Best regards,</p>
                        <p><b>The Menu Team</b></p>`
                 );
                console.log("Email sent successfully");
            } else {
                console.log(`Email already sent to ${winnerEmail} for prize ${prize.name}`);
            }
        }

        res.status(200).json({
            message: "Winner updated successfully",
            updatedRaff,
        });
    } catch (error) {
        console.error("Error updating raffle winner:", error);
        return res.status(500).json({
            error: "An internal error occurred while updating the raffle winner.",
            details: error.message,
        });
    }
};


export const addUserToInvisibleRaffles = async (userId, entries = 1) => {
    try {
        if (entries !== 1 && entries !== 10) {
            throw new Error('Entries must be either 1 or 10');
        }

        // Find all invisible raffles where the user is NOT already a participant
        const invisibleRaffles = await raffModel.find({
            isVisible: false,
            'participants.user': { $ne: userId }
        });

        if (invisibleRaffles.length === 0) {
            console.log('User is already in all invisible raffles or no raffles exist');
            return [];
        }

        // Update raffles ensuring user is added only once
        const updateResult = await raffModel.updateMany(
            {
                _id: { $in: invisibleRaffles.map(r => r._id) }
            },
            {
                $addToSet: {
                    participants: {
                        user: userId,
                        entries: entries  // Ensures unique user, but may not prevent duplicate entries count
                    }
                }
            }
        );

        console.log(`Added user to ${updateResult.modifiedCount} raffles`);
        return await raffModel.find({
            _id: { $in: invisibleRaffles.map(r => r._id) }
        });
    } catch (error) {
        console.error('Error in addUserToInvisibleRaffles:', error);
        throw error;
    }
};
