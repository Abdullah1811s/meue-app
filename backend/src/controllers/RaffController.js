import raffModel from "../models/raff.model.js";
import usersModel from "../models/users.model.js";
import { io } from '../app.js'
import vendorModel from "../models/vendor.model.js";
import { sendEmail } from "../utils/emailService.js";

export const getAllRaff = async (req, res) => {
    try {
        // Populate both participants and winner
        const allRaffles = await raffModel.find()
            .populate('participants.user')
            .populate('winner.user');

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

        //here we have to get the paid user based on the amount they have paid
        /*
            if they have paid the R50 we make there entries 10
            if they have paid the R10 we make there entries 1
        */
        if (!paidUsers || paidUsers.length === 0) {
            return res.status(400).json({ message: "No paid users found to participate in the raffle." });
        }
        const R50Users = await usersModel.find({ userType: "R50" });
        const R10Users = await usersModel.find({ userType: "R10" }, { signupDate: 1 });

        console.log("R50 Users:", R50Users, "R10 Users:", R10Users);

        const participants = [];

       
        if (R50Users && R50Users.length > 0) {
            participants.push(...R50Users.map(user => ({ user: user._id, entries: 10 })));
        }

        const scheduledDateOnly = new Date(scheduledDate).toISOString().split("T")[0];

        if (R10Users && R10Users.length > 0) {
            R10Users.forEach(user => {
                const userSignupDateOnly = new Date(user.signupDate).toISOString().split("T")[0];
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
                .populate('participants')
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
            .populate('participants')
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
        const scheduledReferrals = await raffModel.find({ status: "scheduled" })
            .populate('participants')
            .populate('winner'); // Also populate winner (will be null for scheduled)
        console.log("the raff", scheduledReferrals[2]);
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

export const toggleVisibility = async (req, res) => {
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
        );



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

    console.log("Updating raffle offerings with data:", offerings);

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


export const updateRaffWithWinner = async (req, res) => {
    try {
        const { refId, winnerEmail, prizeId } = req.body;
        let isWinner = false;

        if (!refId || !winnerEmail || !prizeId) {
            return res.status(400).json({ error: "Raffle ID, winner email, and prize ID are required." });
        }

        const winner = await usersModel.findOne({ email: winnerEmail });
        if (!winner) {
            return res.status(404).json({ error: "Winner not found." });
        } else {
            isWinner = true;
        }

        const raffle = await raffModel.findById(refId);
        if (!raffle) {
            return res.status(404).json({ error: "Raffle not found." });
        }

        const prizeIndex = raffle.prizes.findIndex((prize) => prize.id === prizeId);
        if (prizeIndex === -1) {
            return res.status(404).json({ error: "Prize not found in the raffle." });
        }

        const prize = raffle.prizes[prizeIndex];

        // Check if the endDate is today
        const today = new Date();
        if (prize.endDate && prize.endDate.toDateString() === today.toDateString()) {
            // Delete the raffle if the endDate is today
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
                // Remove the prize if quantity is zero
                raffle.prizes.splice(prizeIndex, 1);

                // Check if all prizes are exhausted
                if (raffle.prizes.length === 0) {
                    raffle.status = "completed";
                }
            }
        }

        // If the date is valid (not today) and we have a winner, update the status to "completed"
        if (prize.endDate && prize.endDate > today) {
            raffle.status = "completed";
        }

        // Check if this winner already exists for this prize
        const existingWinnerIndex = raffle.winner.findIndex(
            w => w.user.toString() === winner._id.toString() && w.prize === prize.name
        );

        // Only add the winner if they don't already exist for this prize
        if (existingWinnerIndex === -1) {
            // Push the winner to the winner array
            raffle.winner.push({
                user: winner._id,
                prize: prize.name,
                isEmailSent: false
            });
        }

        const updatedRaff = await raffModel.findByIdAndUpdate(
            refId,
            {
                prizes: raffle.prizes,
                winner: raffle.winner,
                status: raffle.status,
            },
            { new: true }
        ).populate("winner.user");

        if (!updatedRaff) {
            return res.status(404).json({ error: "Raffle not found." });
        }

        const vendor = await vendorModel.findOne({ _id: raffle.vendorId });
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        const offerIndex = vendor.exclusiveOffer.offerings.findIndex((offer) => offer.name === prize.name);
        if (offerIndex === -1) {
            return res.status(404).json({ error: "Offer not found in the vendor's exclusive offers." });
        }

        const offer = vendor.exclusiveOffer.offerings[offerIndex];

        if (offer.quantity !== undefined && offer.quantity !== null) {
            if (offer.quantity <= 0) {
                return res.status(400).json({ error: "Offer quantity is already zero." });
            }

            offer.quantity -= 1;

            if (offer.quantity === 0) {
                vendor.exclusiveOffer.offerings.splice(offerIndex, 1);
            }
        }

        const updatedVendor = await vendorModel.findByIdAndUpdate(
            raffle.vendorId,
            { exclusiveOffer: vendor.exclusiveOffer },
            { new: true }
        );

        if (!updatedVendor) {
            return res.status(404).json({ error: "Vendor not found." });
        }

        console.log("Vendor updated successfully:", updatedVendor);

        // Handle email sending with a more robust approach
        if (isWinner) {
            // Use atomic update to ensure email is only sent once
            const winnerUpdateResult = await raffModel.updateOne(
                {
                    _id: refId,
                    "winner.user": winner._id,
                    "winner.prize": prize.name,
                    "winner.isEmailSent": false // Only update if email hasn't been sent
                },
                {
                    $set: { "winner.$.isEmailSent": true }
                }
            );

            // Only send email if we successfully updated the flag
            if (winnerUpdateResult.modifiedCount > 0) {
                const smtpConfig = {
                    host: "mail.themenuportal.co.za",
                    port: 465,
                    user: "support@themenuportal.co.za",
                };

                console.log(`📩 Sending email to: ${winnerEmail}`);
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