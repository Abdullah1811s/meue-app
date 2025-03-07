import vendorModel from "../models/vendor.model.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/emailService.js";
export const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        const oldVendor = await vendorModel.findOne({ email });
        if (!oldVendor) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const isMatch = await oldVendor.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const detailForToken = { id: oldVendor._id, role: oldVendor.role };
        const token = generateToken(detailForToken);
        res.status(200).json({ message: "Vendor logged in successfully!", vendor: oldVendor, token });
    } catch (error) {
        console.error("Error logging in vendor:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



// the vendor is being register
export const registerVendor = async (req, res) => {
    try {
        const {
            businessName,
            businessType,
            companyRegNumber,
            vatNumber,
            tradingAddress,
            province,
            city,
            businessContactNumber,
            businessEmail,
            websiteUrl,
            socialMediaHandles,
            representativeName,
            representativePosition,
            representativeEmail,
            representativePhone,
            businessDescription,
            offerings,
            exclusiveOffer,
            vendorTier,
            agreedToTerms,
            companyRegistrationCertificateURl,
            vendorIdURl,
            addressProofURl,
            confirmationLetterURl,
            businessPromotionalMaterialURl,
            password
        } = req.body;
        console.log(req.body);
        const existingVendor = await vendorModel.findOne({ businessEmail });
        if (existingVendor) {
            return res.status(400).json({ message: "Partner already exists" });
        }
        if (
            !businessName ||
            !businessType ||
            !companyRegNumber ||
            !tradingAddress ||
            !businessContactNumber ||
            !businessEmail ||
            !representativeName ||
            !representativePosition ||
            !representativeEmail ||
            !representativePhone ||
            !agreedToTerms ||
            !exclusiveOffer
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newVendor = await vendorModel.create({
            businessName,
            businessType,
            companyRegNumber,
            vatNumber,
            tradingAddress,
            province,
            city,
            businessContactNumber,
            businessEmail,
            websiteUrl,
            socialMediaHandles,

            representativeName,
            representativePosition,
            representativeEmail,
            representativePhone,
            businessDescription,
            offerings,
            exclusiveOffer,
            vendorTier,
            agreedToTerms,
            companyRegistrationCertificateURl,
            vendorIdURl,
            addressProofURl,
            confirmationLetterURl,
            businessPromotionalMaterialURl,
            password
        });
        res.status(201).json({ message: "Vendor created successfully", vendor: newVendor });
    } catch (error) {
        console.error("Error registering vendor:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get all vendors
export const getVendors = async (req, res) => {
    try {
        // Fetch all vendors from the database
        const vendors = await vendorModel.find();

        const updatedVendors = vendors.map(vendor => {
            const { companyRegistrationCertificateURl, vendorIdURl, addressProofURl, confirmationLetterURl, ...rest } = vendor.toObject();
            return rest;
        });


        res.status(200).json(updatedVendors);
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get a vendor by ID
export const getVendorById = async (req, res) => {
    try {
        const vendor = await vendorModel.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getALlDetails = async (req, res) => {
    try {
        const vendor = await vendorModel.find();
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const updateVendorStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        console.log(req.body);

        // Validate input
        if (!id || !status) {
            return res.status(400).json({ message: "Vendor ID and status are required" });
        }

        // Ensure the status is valid
        const validStatuses = ["pending", "approved", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Find and update vendor status
        const updatedVendor = await vendorModel.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Returns the updated document
        );

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        let emailSent = { success: true }; // Default to prevent undefined errors

        if (updatedVendor.businessEmail) {
            if (status === "approved") {
                const subject = "Your Vendor Application is Approved 🎉";
                const message = `
                    <p>Dear ${updatedVendor.fullName},</p>
                    <p>Congratulations! Your vendor application has been <strong>approved</strong>. 🎉</p>
                    <p>You can now proceed to <strong>Partner → Register → Login</strong> to access your vendor dashboard and start managing your business.</p>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Best regards, <br> The Menu Team</p>
                `;

                emailSent = await sendEmail(updatedVendor.businessEmail, subject, "Your vendor application has been approved.", message);
            } else if (status === "rejected") {
                const subject = "Your Vendor Application Status";
                const message = `
                    <p>Dear ${updatedVendor.fullName},</p>
                    <p>We appreciate your interest in becoming a vendor on our platform. After review, we regret to inform you that your application has been <strong>rejected</strong>.</p>
                    <p>If you have any questions or would like to reapply in the future, please feel free to reach out.</p>
                    <p>Best regards, <br> The Menu Team</p>
                `;

                emailSent = await sendEmail(updatedVendor.businessEmail, subject, "Your vendor application was not approved.", message);
            }

            if (!emailSent.success) {
                console.error("Email sending failed but status updated.");
            }
        } else {
            console.warn("Vendor email not found, skipping email notification.");
        }

        return res.status(200).json({
            message: `Vendor status updated to '${status}' successfully`,
            vendor: updatedVendor,
            emailSent: emailSent.success ? "Email sent successfully" : "Email failed to send",
        });

    } catch (error) {
        console.error("Error updating vendor status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateVendorDetails = async (req, res) => {

};