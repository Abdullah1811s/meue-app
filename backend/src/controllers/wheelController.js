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
        const totalOfferings = await wheelModel.aggregate([
            {
                $facet: {
                    vendorOfferings: [
                        { $unwind: "$vendor.offerings" },
                    ],
                    adminOfferings: [
                        { $unwind: "$admin.offerings" },
                    ]
                }
            },
            {
                $project: {
                    totalOfferings: {
                        $add: [{ $size: "$vendorOfferings" }, { $size: "$adminOfferings" }]
                    }
                }
            }
        ]);

        const totalOfferingsCount = totalOfferings[0]?.totalOfferings || 0;
        console.log("Total offerings count: ", totalOfferingsCount);

        // Check if total offerings are more than 10
        if (totalOfferingsCount >= 10) {
            return res.status(400).json({ message: "Wheel limit exceeded! Please remove an entry before adding a new one." });
        }
        // const currentTotal = await getTotalOfferings();
        // if (currentTotal === null) {
        //     return res.status(500).json({ message: "Error fetching total offerings" });
        // }

        // if (currentTotal + offerings.length > max) {
        //     return res.status(409).json({ message: `You can only have a maximum of ${max} offerings on the wheel.` });
        // }

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


export const addWheelEntry = async (req, res) => {
    try {
        const { admin } = req.body;

        // Use aggregation to count the total offerings from both vendor and admin
        const totalOfferings = await wheelModel.aggregate([
            {
                $facet: {
                    vendorOfferings: [
                        { $unwind: "$vendor.offerings" },
                    ],
                    adminOfferings: [
                        { $unwind: "$admin.offerings" },
                    ]
                }
            },
            {
                $project: {
                    totalOfferings: {
                        $add: [{ $size: "$vendorOfferings" }, { $size: "$adminOfferings" }]
                    }
                }
            }
        ]);

        const totalOfferingsCount = totalOfferings[0]?.totalOfferings || 0;
        console.log("Total offerings count: ", totalOfferingsCount);

        // Check if total offerings are more than 10
        if (totalOfferingsCount >= 10) {
            return res.status(400).json({ message: "Wheel limit exceeded! Please remove an entry before adding a new one." });
        }

        // Create a new wheel entry
        const newWheelEntry = new wheelModel({
            vendor: null,
            admin: {
                adminInfo: admin.adminInfo || null, // Set to null if not provided
                offerings: admin.offerings
            }
        });

        await newWheelEntry.save();

        res.status(201).json({
            success: true,
            message: "New wheel entry added successfully",
            data: newWheelEntry
        });

    } catch (error) {
        console.error("Error adding wheel entry:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



export const getAllOnWheel = async (req, res) => {
    try {

        let allEntries = await wheelModel.find()
            .populate("vendor.vendorInfo")
            .populate("admin.adminInfo");

        const validEntries = [];

        for (const entry of allEntries) {
            const vendorEmpty = (!entry.vendor.offerings || entry.vendor.offerings.length === 0);
            const adminEmpty = (!entry.admin.offerings || entry.admin.offerings.length === 0);
            console.log("vendors : ", vendorEmpty, " admin : ", adminEmpty);
            if (vendorEmpty && adminEmpty) {
                // Delete the document if both vendor and admin info/offerings are empty
                await entry.delete();
                console.log(`Deleted empty wheel with ID ${entry._id}`);
            } else {
                validEntries.push(entry);
            }
        }

        // if (validEntries.length === 0) {
        //     console.log("No valid vendors or admins found on the wheel.");
        //     return res.status(404).json({ message: "No valid vendors or admins found on the wheel" });
        // }

        return res.status(200).json({
            message: "Vendors and Admins retrieved successfully",
            data: validEntries,
        });

    } catch (error) {
        console.error("Error fetching vendors and admins:", error);
        return res.status(500).json({ message: "Unable to fetch data! Please try again later" });
    }
};


export const removeVendorFromWheel = async (req, res) => {
    try {
        const { vendorInfo } = req.body;

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



export const delOffer = async (req, res) => {
    const { offerId } = req.params;

    if (!offerId) {
        return res.status(400).json({ message: "Offer ID is required" });
    }

    try {
        const objectIdOfferId = new mongoose.Types.ObjectId(offerId);

        // Try to find in Vendor first
        let wheel = await wheelModel.findOne({ "vendor.offerings._id": objectIdOfferId })
            .populate("vendor.vendorInfo")
            .populate("admin.adminInfo");

        if (wheel) {
            wheel.vendor.offerings = wheel.vendor.offerings.filter(
                (offering) => !offering._id.equals(objectIdOfferId)
            );

            // Save the updated wheel
            await wheel.save();
        } else {
            // Try to find in Admin
            wheel = await wheelModel.findOne({ "admin.offerings._id": objectIdOfferId })
                .populate("vendor.vendorInfo")
                .populate("admin.adminInfo");

            if (wheel) {
                wheel.admin.offerings = wheel.admin.offerings.filter(
                    (offering) => !offering._id.equals(objectIdOfferId)
                );

                await wheel.save();
            } else {
                return res.status(404).json({ message: "Offer not found in Vendor or Admin" });
            }
        }

        // After deletion, check if both vendor and admin are now empty/null
        const vendorEmpty = (!wheel.vendor.offerings || wheel.vendor.offerings.length === 0);
        const adminEmpty = (!wheel.admin.offerings || wheel.admin.offerings.length === 0);
        console.log("vendor: ", vendorEmpty, " admin : ", adminEmpty);
        if (vendorEmpty && adminEmpty) {
            await wheel.delete();
            return res.status(200).json({ message: "Offer deleted and wheel was empty, so it was removed." });
        }

        return res.status(200).json({
            message: "Offer deleted successfully",
            updatedWheel: wheel,
        });

    } catch (error) {
        console.error("Error deleting offer:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const updateVendorExclusiveOffer = async (req, res) => {
    const { vendorId } = req.params;
    const { wheelOffer } = req.body;
    console.log("Updating offer with data:", req.body, "and id is", vendorId);

    try {
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ message: 'Invalid vendor ID' });
        }

        // First check if vendor exists in Vendor model
        const vendorExists = await vendorModel.findById(vendorId);
        if (!vendorExists) {
            return res.status(404).json({ message: 'Vendor not found in vendor database' });
        }

        const updateData = {
            'vendor.offerings': wheelOffer.offerings.map(offering => ({
                name: offering.name,
                quantity: offering.quantity !== undefined ? offering.quantity : null,
                startDate: offering.startDate || null,
                endDate: offering.endDate || null,
                _id: offering._id ? offering._id : new mongoose.Types.ObjectId()
            }))
        };

        console.log("Formatted update data:", updateData);

        // Check if vendor exists in Wheel model
        let existingWheel = await wheelModel.findOne({ 'vendor.vendorInfo': vendorId });

        if (!existingWheel) {
            // Vendor doesn't exist in Wheel model - create new entry
            console.log("Vendor not found in Wheel model, creating new entry...");

            const newWheelEntry = new wheelModel({
                vendor: {
                    vendorInfo: vendorId,
                    offerings: updateData['vendor.offerings']
                }
            });

            const savedWheel = await newWheelEntry.save();
            console.log("New wheel entry created:", savedWheel);

            return res.status(201).json({
                message: 'New vendor wheel entry created successfully',
                data: savedWheel,
            });
        }

        // Vendor exists in Wheel model - update existing entry
        console.log("Vendor found in Wheel model. Proceeding with update...");

        const updatedVendor = await wheelModel.findOneAndUpdate(
            { 'vendor.vendorInfo': vendorId },
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
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


export const updateWinner = async (req, res) => {
    try {
        const { label, labelId, vendorId, id, vId, adminId } = req.body;
        console.log("The data from the front end is", req.body);

        // Check if the user exists
        let updatedVendor;
        const userExists = await usersModel.findOne({ _id: id });
        if (!userExists)
            return res.status(404).json({ message: "User not found" });

        // Find the wheel with vendor and admin data
        const wheel = await wheelModel.findOne({ _id: vendorId });
        if (!wheel) return res.status(404).json({ message: "Wheel not found" });

        const today = new Date();
        let updated = false;
        let shouldDeleteWheel = false;
        let vendorOfferingsUpdated = false;

        // ==================== 🛠 VENDOR UPDATE ====================
        if (wheel.vendor && wheel.vendor.offerings) {
            const vendorOfferIndex = wheel.vendor.offerings.findIndex(o => o._id.toString() === labelId);

            if (vendorOfferIndex !== -1) {
                const vendorOffer = wheel.vendor.offerings[vendorOfferIndex];
                updated = true;
                vendorOfferingsUpdated = true;

                // Check if offer has expired
                if (vendorOffer.endDate && today >= new Date(vendorOffer.endDate)) {
                    wheel.vendor.offerings.splice(vendorOfferIndex, 1);
                    console.log("Removed expired vendor offer");
                }
                // Only handle quantity reduction if quantity exists
                else if (vendorOffer.quantity !== undefined) {
                    if (vendorOffer.quantity > 0) {
                        vendorOffer.quantity -= 1;
                        console.log(`Reduced vendor offer quantity to ${vendorOffer.quantity}`);

                        if (vendorOffer.quantity === 0) {
                            wheel.vendor.offerings.splice(vendorOfferIndex, 1);
                            console.log("Removed vendor offer with zero quantity");
                        }
                    }
                }

                if (!wheel.vendor.offerings || wheel.vendor.offerings.length === 0) {
                    shouldDeleteWheel = true;
                    console.log("Marked wheel for deletion as vendor offerings became empty");
                }
            }
        }

        // ==================== 🛠 ADMIN UPDATE ====================
        if (wheel.admin && wheel.admin.offerings) {
            const adminOfferIndex = wheel.admin.offerings.findIndex(o => o._id.toString() === labelId);

            if (adminOfferIndex !== -1) {
                const adminOffer = wheel.admin.offerings[adminOfferIndex];
                updated = true;

                // Check if offer has expired
                if (adminOffer.endDate && today >= new Date(adminOffer.endDate)) {
                    wheel.admin.offerings.splice(adminOfferIndex, 1);
                    console.log("Removed expired admin offer");
                }
                // Only handle quantity reduction if quantity exists
                else if (adminOffer.quantity !== undefined) {
                    if (adminOffer.quantity > 0) {
                        adminOffer.quantity -= 1;
                        console.log(`Reduced admin offer quantity to ${adminOffer.quantity}`);

                        if (adminOffer.quantity === 0) {
                            wheel.admin.offerings.splice(adminOfferIndex, 1);
                            console.log("Removed admin offer with zero quantity");
                        }
                    }
                }

                if (!wheel.admin.offerings || wheel.admin.offerings.length === 0) {
                    shouldDeleteWheel = true;
                    console.log("Marked wheel for deletion as admin offerings became empty");
                }
            }
        }

        if (!updated) {
            return res.status(404).json({ message: "Offer not found in vendor or admin offerings" });
        }

        if (shouldDeleteWheel) {
            await wheel.delete();
            console.log("Deleted wheel document as it became empty");
        } else {
            await wheel.save();
        }

        // ==================== 🛠 VENDOR SCHEMA UPDATE ====================
        if (vendorOfferingsUpdated && wheel.vendor?.vendorInfo) {
            updatedVendor = await vendorModel.findByIdAndUpdate(
                wheel.vendor.vendorInfo,
                { "wheelOffer.offerings": wheel.vendor.offerings },
                { new: true }
            );
            console.log("Vendor wheel offerings updated:", updatedVendor);
        }

        // ==================== 🛠 USER UPDATE ====================
        await addPoints(userExists._id, 10);
        userExists.wheelRotatePoint += 10;

        await userExists.save();
        const update = await usersModel.findByIdAndUpdate(
            id,
            { $push: { prizeWon: label } },
            { new: true }
        );

        // Email notification
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "support@themenuportal.co.za",
        };

        const userEmailSubject = "🎉 Congratulations! You've Won a Prize 🎉";
        const userEmailText = `Dear ${update.name}, you have won the prize: ${label}.`;
        const userEmailHtml = `
        <p>Dear ${update.name},</p>
      
        <h2> You spun. You won! </h2>
        <p><strong>${label}</strong> is now yours. </p>
      
        <p>Our partners are awaiting your redemption!</p>
        <p>Please reach out to <strong>THE MENU</strong> should you have any issues with redeeming your prize.</p>
      
        <p>
    <a href="https://themenuportal.co.za/Login" style="display: inline-block; background: #DBC166; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 10px;">
      USER LOGIN
    </a>
  </p>
      
        <p>Stay spinning. Stay winning. </p>
      
        <br/>
        <p>Thanks for being part of the movement.</p>
        <p><strong>The Menu Team</strong></p>
        <p>Contact: <a href="mailto:support@themenu.co.za">support@themenu.co.za</a></p>
        <p>Website: <a href="https://themenuportal.co.za/">https://themenuportal.co.za/</a></p>
      `;

        await sendEmail(smtpConfig, update.email, userEmailSubject, userEmailText, userEmailHtml);
        const smtpConfig2 = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "partners@themenuportal.co.za",
        };
        if (updatedVendor) {
            const vendorEmailSubject = "A User Has Won a Prize";
            const vendorEmailText = `A user has won the prize: ${label}.`;
            const vendorEmailHtml = `<p>A user has won the prize: <strong>${label}</strong>.</p>
                                     <p>User details:</p>
                                     <ul>
                                       <li>Name: ${update.name}</li>
                                       <li>Email: ${update.email}</li>
                                       <li>Address: ${update.street}, ${update.town}, ${update.city}, ${update.province}, ${update.postalCode}</li>
                                     </ul>`;
            await sendEmail(smtpConfig2, updatedVendor.businessEmail, vendorEmailSubject, vendorEmailText, vendorEmailHtml);
        }

        return res.status(200).json({
            message: "Offer updated successfully",
            data: update
        });

    } catch (error) {
        console.error("Error updating vendors/admin:", error);
        return res.status(500).json({ message: "Please try again later" });
    }
};