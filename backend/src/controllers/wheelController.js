import usersModel from "../models/users.model.js";
import vendorModel from "../models/vendor.model.js";
import wheelModel from "../models/wheel.model.js";
import { sendEmail } from "../utils/emailService.js";
import { addPoints } from "../utils/pointsService.js"
import mongoose from 'mongoose';
const max = 15;

const getTotalOfferings = async () => {
    try {
        const totalOfferings = await wheelModel.aggregate([
            { $unwind: "$vendor.offerings" },
            { $count: "totalOffers" }
        ]);
        return totalOfferings[0]?.totalOffers || 0;
    } catch (error) {
        console.error("Error counting total offerings:", error);
        return null;
    }
};


export const addVendorOnWheel = async (req, res) => {
    try {
        const { vendorInfo, offerings } = req.body;

        if (!vendorInfo) {
            return res.status(400).json({ message: "Please provide the vendor details." });
        }
        if (!Array.isArray(offerings) || offerings.length === 0) {
            return res.status(400).json({ message: "Please provide at least one offering." });
        }

        const currentTotal = await getTotalOfferings();
        if (currentTotal === null) {
            return res.status(500).json({ message: "Error fetching total offerings" });
        }

        if (currentTotal + offerings.length > max) {
            return res.status(409).json({ message: `You can only have a maximum of ${max} offerings on the wheel.` });
        }

        const updatedVendor = await wheelModel.findOneAndUpdate(
            { "vendor.vendorInfo": vendorInfo },
            { $push: { "vendor.offerings": { $each: offerings } } },
            { new: true, upsert: true }
        );
        return res.status(201).json({ message: "Vendor added/updated successfully!", data: updatedVendor });

    } catch (error) {
        console.error("Error adding Partner to wheel:", error);
        return res.status(500).json({ message: "Unable to add Partner on wheel! Please try again later" });
    }
};



export const getAllVendorOnWheel = async (req, res) => {
    try {
        const allVendors = await wheelModel.find().populate("vendor.vendorInfo");

        if (!allVendors || allVendors.length === 0) {
            return res.status(404).json({ message: "No vendors found on the wheel" });
        }

        return res.status(200).json({ message: "Vendors retrieved successfully", data: allVendors });

    } catch (error) {
        console.error("Error fetching vendors:", error);
        return res.status(500).json({ message: "Unable to fetch vendors! Please try again later" });
    }
};







export const removeVendorFromWheel = async (req, res) => {
    try {
        const { vendorInfo } = req.body;
        console.log("Deleting vendor from wheel", req.body);

        if (!vendorInfo) {
            return res.status(400).json({ message: "Please provide the partner info" });
        }

        const isVendorOnWheel = await wheelModel.findOne({ "vendor.vendorInfo": vendorInfo });

        if (!isVendorOnWheel) {

            return res.status(200).json({ message: "Partner is not on the wheel, no action taken" });
        }
        await wheelModel.findOneAndDelete({ "vendor.vendorInfo": vendorInfo });

        return res.status(200).json({ message: "Partner has been removed from the wheel" });

    } catch (error) {
        console.error("Error removing partner from wheel:", error);
        return res.status(500).json({ message: "Unable to remove partner from wheel! Please try again later" });
    }
};



export const updateVendorExclusiveOffer = async (req, res) => {
    const { vendorId } = req.params;
    const { exclusiveOffer } = req.body;
    console.log("Updating offer with data:", req.body);

    try {

        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ message: 'Invalid vendor ID' });
        }

        if (!exclusiveOffer || !exclusiveOffer.offerings || !Array.isArray(exclusiveOffer.offerings)) {
            return res.status(400).json({ message: 'Invalid exclusive offer data' });
        }

        const isValidOfferings = exclusiveOffer.offerings.every(offering =>
            offering.name && (offering.quantity !== undefined || (offering.startDate && offering.endDate))
        );

        


        const updateData = {
            'vendor.offerings': exclusiveOffer.offerings.map(offering => ({
                name: offering.name,
                quantity: offering.quantity !== undefined ? offering.quantity : null,
                startDate: offering.startDate || null,
                endDate: offering.endDate || null,
                _id: offering._id ? offering._id : new mongoose.Types.ObjectId() // Preserve _id or generate new
            }))
        };

        console.log("Formatted update data:", updateData);


        const existingVendor = await wheelModel.findOne({ 'vendor.vendorInfo': new mongoose.Types.ObjectId(vendorId) });

        if (!existingVendor) {
            console.log("Vendor not found, update aborted.");
            return res.status(404).json({ message: 'Vendor not found' });
        }

        console.log("Vendor found. Proceeding with update...");


        const updatedVendor = await wheelModel.findOneAndUpdate(
            { 'vendor.vendorInfo': new mongoose.Types.ObjectId(vendorId) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log("Updated vendor data:", updatedVendor);

        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found after update' });
        }

        res.status(200).json({
            message: 'Exclusive offer updated successfully',
            data: updatedVendor,
        });
    } catch (error) {
        console.error('Error updating vendor exclusive offer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const delOffer = async (req, res) => {
    const { offerId } = req.params;

    if (!offerId) {
        return res.status(400).json({ message: "Offer ID is required" });
    }

    try {
        // Convert offerId to ObjectId to match the database format
        const objectIdOfferId = new mongoose.Types.ObjectId(offerId);

        // Find the document that contains the offer
        const wheel = await wheelModel.findOne({ "vendor.offerings._id": objectIdOfferId });

        if (!wheel) {
            return res.status(404).json({ message: "Offer not found in any Wheel document" });
        }

        // Remove the specific offer from the offerings array
        wheel.vendor.offerings = wheel.vendor.offerings.filter(
            (offering) => !offering._id.equals(objectIdOfferId)
        );

        // Save the updated document
        await wheel.save();

        return res.status(200).json({
            message: "Offer deleted successfully",
            updatedWheel: wheel,
        });
    } catch (error) {
        console.error("Error deleting offer:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};





export const updateWinner = async (req, res) => {
    try {
        const { label, labelId, vendorId, id, vId } = req.body;
        console.log("The data from the front end is", req.body);

        // Check if the user exists
        const userExists = await usersModel.findOne({ _id: id });
        if (!userExists)
            return res.status(404).json({ message: "User not found" });

        // Find the wheel and the specific offering
        const wheel = await wheelModel.findOne(
            { _id: vendorId, 'vendor.offerings._id': labelId },
            { 'vendor.offerings.$': 1 }
        );
        const offer = wheel.vendor.offerings[0];
        if (!wheel || !wheel.vendor.offerings || wheel.vendor.offerings.length === 0)
            return res.status(404).json({ message: "Offer not found" });

        const today = new Date();


        if (offer.endDate && today >= new Date(offer.endDate)) {
            await wheelModel.updateOne(
                { _id: vendorId },
                { $pull: { 'vendor.offerings': { _id: labelId } } }
            );
            return res.status(200).json({ message: "Offer deleted as it has reached the end date" });
        }

        if (offer.quantity !== undefined) {
            if (offer.quantity > 0) {
                offer.quantity -= 1;

                if (offer.quantity === 0) {
                    await wheelModel.updateOne(
                        { _id: vendorId },
                        { $pull: { 'vendor.offerings': { _id: labelId } } }
                    );
                } else {
                    await wheelModel.updateOne(
                        { _id: vendorId, 'vendor.offerings._id': labelId },
                        { $set: { 'vendor.offerings.$': offer } }
                    );
                }
            } else {
                return res.status(400).json({ message: "Quantity is already zero" });
            }
        }

        const update = await usersModel.findByIdAndUpdate(
            id,
            { prizeWon: label },
            { new: true }
        );
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "support@themenuportal.co.za",
        };

        const userEmailSubject = "🎉 Congratulations! You've Won a Prize 🎉";
        const userEmailText = `Dear ${userExists.name}, you have won the prize: ${label}. 🎊🎁`;
        const userEmailHtml = `
          <p>Dear ${userExists.name},</p>
          <p>🎉🎉 <strong>Congratulations!</strong> 🎉🎉</p>
          <p>You have won the prize: <strong>${label}</strong>. 🎁✨</p>
          <p>We're so excited for you! 🥳</p>
          <p>Best regards,<br/>The Menu Team</p>
        `;
        await sendEmail(smtpConfig, userExists.email, userEmailSubject, userEmailText, userEmailHtml);
        userExists.wheelRotatePoint += 10
        await addPoints(userExists._id, userExists.wheelRotatePoint);


        const vendor = await vendorModel.findOne({ _id: vId });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }


        const vendorOfferIndex = vendor.exclusiveOffer.offerings.findIndex((o) => o.name === label);
        if (vendorOfferIndex === -1) {
            return res.status(404).json({ message: "Offer not found in vendor's exclusive offerings" });
        }

        const vendorOffer = vendor.exclusiveOffer.offerings[vendorOfferIndex];


        if (vendorOffer.quantity !== undefined) {
            if (vendorOffer.quantity > 0) {
                vendorOffer.quantity -= 1;


                if (vendorOffer.quantity === 0) {
                    vendor.exclusiveOffer.offerings.splice(vendorOfferIndex, 1);
                }
            } else {
                return res.status(400).json({ message: "Vendor offer quantity is already zero" });
            }
        }

        await vendorModel.findByIdAndUpdate(
            vId,
            { exclusiveOffer: vendor.exclusiveOffer },
            { new: true }
        );


        const smtpConfig2 = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "vendors@themenuportal.co.za",
        };

        const vendorEmailSubject = "A User Has Won a Prize";
        const vendorEmailText = `A user has won the prize: ${label}. User details: Name: ${userExists.name}, Email: ${userExists.email}, Address: ${userExists.street}, ${userExists.town}, ${userExists.city}, ${userExists.province}, ${userExists.postalCode}.`;
        const vendorEmailHtml = `<p>A user has won the prize: <strong>${label}</strong>.</p>
                                 <p>User details:</p>
                                 <ul>
                                   <li>Name: ${userExists.name}</li>
                                   <li>Email: ${userExists.email}</li>
                                   <li>Address: ${userExists.street}, ${userExists.town}, ${userExists.city}, ${userExists.province}, ${userExists.postalCode}</li>
                                 </ul>`;
        await sendEmail(smtpConfig2, vendor.businessEmail, vendorEmailSubject, vendorEmailText, vendorEmailHtml);


        return res.status(200).json({ message: "Offer updated successfully", data: update });
    } catch (error) {
        console.error("Error updating vendors:", error);
        return res.status(500).json({ message: "Please try again later" });
    }
};