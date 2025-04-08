import vendorModel from "../models/vendor.model.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/emailService.js";
import { v2 as cloudinary } from 'cloudinary'
import usersModel from '../models/users.model.js';
import { addPoints } from '../utils/pointsService.js'
import referralModel from "../models/referral.model.js";
import jwt from 'jsonwebtoken'
import affiliateModel from "../models/affiliate.model.js";
import crypto from 'crypto';


const generateResetToken = (vendorId) => {
    return jwt.sign(
        { id: vendorId },
        process.env.JWT_SECRET + '-reset', // Different secret for reset tokens
        { expiresIn: '1h' } // Short-lived token
    );
};

const checkCode = async (code, _id) => {
    try {
        console.log("Checking referral code:", code, "for user ID:", _id);

        const referrerUser = await usersModel.findOne({ referralCodeShare: code });
        const referrerAffiliate = await affiliateModel.findOne({ referralCode: code });

        if (referrerUser) {
            console.log("Referral belongs to a User:", referrerUser._id);

            const newReferrer = await referralModel.create({
                referrer: referrerUser._id,
                referrerModel: "User",
                referredUser: _id,
                referralCode: code,
                status: "pending",
            });

            referrerUser.ReferralPoint += 100;
            await referrerUser.save();
            await addPoints(referrerUser._id, referrerUser.ReferralPoint);

            return "valid";
        } else if (referrerAffiliate) {
            console.log("Referral belongs to an Affiliate:", referrerAffiliate._id);

            await referralModel.create({
                referrer: referrerAffiliate._id,
                referrerModel: "Affiliate",
                referredUser: _id,
                referralCode: code,
                status: "pending",
            });

            await referrerAffiliate.save();

            return "valid";
        } else {
            console.log("No valid referrer found for the code:", code);
            return "invalid";
        }
    } catch (error) {
        console.error("Error checking referral code:", error);
        return "error";
    }
};


const deleteFile = async (publicId) => {
    try {
        console.log("in fun");
        const fileExtension = publicId.split('.').pop().toLowerCase();
        let resourceType = "image";

        if (['pdf', 'doc', 'docx', 'txt', 'csv', 'xlsx', 'ppt'].includes(fileExtension)) {
            resourceType = "raw";
        }
        console.log("The resource type is ", resourceType);
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
            type: "upload"
        });

        console.log('Deleted:', result);
        return result;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

export const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const oldVendor = await vendorModel.findOne({ businessEmail: email });
        if (!oldVendor) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await oldVendor.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const detailForToken = { id: oldVendor._id, role: oldVendor.role };
        const token = generateToken(detailForToken);

        res.status(200).json({
            message: "Vendor logged in successfully!",
            vendor: { id: oldVendor._id, email: oldVendor.email, role: oldVendor.role, status: oldVendor.status }, // Limit exposed data
            token
        });
    } catch (error) {
        console.error("Error logging in vendor:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Get all vendors
export const getVendors = async (req, res) => {
    try {
        // Fetch all vendors from the database
        const vendors = await vendorModel.find();

        const updatedVendors = vendors.map(vendor => {
            const { companyRegistrationCertificateURl, vendorIdURl, addressProofURl, confirmationLetterURl, password, resetPasswordToken, resetPasswordExpire, ...rest } = vendor.toObject();
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

        const {
            companyRegistrationCertificateURl,
            vendorIdURl,
            addressProofURl,
            confirmationLetterURl,
            password,
            resetPasswordToken,
            resetPasswordExpire,
            ...safeVendor
        } = vendor.toObject();

        res.status(200).json(safeVendor);

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
        const updatedVendors = vendor.map(vendor => {
            const { password, ...rest } = vendor.toObject();
            return rest;
        });

        res.status(200).json(updatedVendors)
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}



export const delVendor = async (req, res) => {
    try {
        const { id, cancelReason } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Provide the id" });
        }

        // Find the vendor first to get their email
        const vendor = await vendorModel.findOne({ _id: id });

        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        if (vendor.businessEmail) {
            const subject = "Partner Account Cancelled";
            let message;

            if (vendor.status === "pending") {
                message = `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Dear ${vendor.businessName || "Partner"},</p>

      <p>We regret to inform you that your partner account has been cancelled.</p>

      <p><strong>Reason for cancellation:</strong> ${cancelReason || "No reason provided"}</p>

      <p>If you have any questions regarding this decision, please contact our support team at 
      <a href="mailto:support@themenuportal.co.za" style="color: #1a73e8;">support@themenuportal.co.za</a>.</p>

      <p>We appreciate your time with us and hope to serve you again in the future.</p>

      <p>Best regards,<br>
      The Menu Team</p>
    </body>
  </html>
`;

            }

            if (vendor.status === "approved") {
                message = `
                <html>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
                    <p>Dear ${vendor.businessName || "Partner"},</p>
              
                    <p>We regret to inform you that your partner account has been cancelled.</p>
              
                    <p><strong>Reason for cancellation:</strong> ${cancelReason || "No reason provided"}</p>
              
                    <p>
                      Since your account has already been approved, we understand this may come as a surprise.
                      If you have any questions or wish to appeal this decision, please reach out to our support team
                      as soon as possible for further clarification.
                    </p>
              
                    <p>We value your participation, and we're here to assist you.</p>
              
                    <p>Regards,<br>
                    The Menu Team</p>
                  </body>
                </html>
              `;

            }

            const smtpConfig = {
                host: "mail.themenuportal.co.za",
                port: 465,
                user: "partners@themenuportal.co.za",
            };

            try {
                await sendEmail(smtpConfig, vendor.businessEmail, subject, "Your Partner account has been cancelled.", message);
                console.log(`Cancellation email sent to ${vendor.businessEmail}`);
            } catch (emailError) {
                console.error("Failed to send cancellation email:", emailError);
            }
        }

        // Assuming vendor object contains the URLs for the files
        if (vendor.addressProofURl?.public_id) {
            console.log(vendor.addressProofURl.public_id);
            deleteFile(vendor.addressProofURl.public_id);
        }

        if (vendor.companyRegistrationCertificateURl?.public_id) {
            console.log(vendor.companyRegistrationCertificateURl.public_id);
            deleteFile(vendor.companyRegistrationCertificateURl.public_id);
        }

        if (vendor.vendorIdURl?.public_id) {
            console.log(vendor.vendorIdURl.public_id);
            deleteFile(vendor.vendorIdURl.public_id);
        }

        if (vendor.confirmationLetterURl?.public_id) {
            console.log(vendor.confirmationLetterURl.public_id);
            deleteFile(vendor.confirmationLetterURl.public_id);
        }

        if (vendor.businessPromotionalMaterialURl?.public_id) {
            console.log(vendor.businessPromotionalMaterialURl.public_id);
            deleteFile(vendor.businessPromotionalMaterialURl.public_id);
        }

        const result = await vendorModel.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Vendor not found or already deleted" });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor deleted successfully",
            emailSent: !!vendor.businessEmail
        });

    } catch (error) {
        console.error("Error deleting vendor:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete vendor",
            error: error.message
        });
    }
};

export const vendorTierUpdate = async (req, res) => {
    try {

        const { id, vendorTier } = req.body;


        if (!id || !vendorTier) {
            return res.status(400).json({
                success: false,
                message: "Please provide vendor ID and tier"
            });
        }

        const updatedVendor = await vendorModel.findByIdAndUpdate(
            id,
            { vendorTier },
            { new: true }
        );

        if (!updatedVendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }
        const { password, companyRegistrationCertificateURl, vendorIdURl, addressProofURl, confirmationLetterURl, businessPromotionalMaterialURl, ...safeVendor } = updatedVendor.toObject();
        return res.status(200).json({
            success: true,
            message: "Vendor tier updated successfully",
            data: safeVendor
        });

    } catch (error) {

        console.error("Error updating vendor tier:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating vendor tier",
            error: error.message
        });
    }
};


export const updateVendorStatus = async (req, res) => {
    try {
        const { id, status, reason } = req.body;

        if (!id || !status) {
            return res.status(400).json({ message: "Vendor ID and status are required" });
        }


        const validStatuses = ["pending", "approved", "rejected"];


        const updatedVendor = await vendorModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        let emailSent = { success: true };

        if (updatedVendor.businessEmail) {
            let subject, message;

            if (status === "approved") {
                subject = "Your Partner Application is Approved 🎉";
                message = `
                    <p>Dear ${updatedVendor.businessName},</p>
                    <p>Congratulations! Your vendor application has been <strong>approved</strong>. 🎉</p>
                    <p>To get started, please <a href="https://themenuportal.co.za/vendor/login" target="_blank">log in to your vendor account</a>.</p>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Best regards, <br> The Menu Team</p>
                `;

            } else if (status === "rejected") {
                subject = "Update on Your Partner Application";
                message = `
                    <p>Dear ${updatedVendor.businessName},</p>
                    <p>Thank you for your interest in partnering with us. After careful consideration, we regret to inform you that we're unable to approve your application at this time.</p>
                    
                    ${reason ? `
                    <p><strong>Reason for rejection:</strong><br>
                    ${reason}</p>
                    ` : ''}
                
                    <p>This decision was based on our current partnership criteria and business needs. We genuinely appreciate the time and effort you put into your application.</p>
                
                    <p>If you would like to:
                    <ul>
                        <li>Discuss this decision further</li>
                        <li>Address the reasons for rejection</li>
                        <li>Reapply in the future</li>
                    </ul>
                    please don't hesitate to contact our partnership team.</p>
                
                    <p>We wish you success in your business endeavors and hope we might have the opportunity to collaborate in the future.</p>
                
                    <p>Best regards,<br>
                    The Partnership Team</p>
                `;
            }

            if (subject && message) {
                const smtpConfig = {
                    host: "mail.themenuportal.co.za",
                    port: 465,
                    user: "partners@themenuportal.co.za",
                };

                const emailSent = await sendEmail(smtpConfig, updatedVendor.businessEmail, subject, subject, message);

                if (!emailSent.success) {
                    console.error("Email sending failed but status updated.");
                }
            }
        } else {
            console.warn("Vendor email not found, skipping email notification.");
        }


        const { password, ...safeVendor } = updatedVendor.toObject();

        return res.status(200).json({
            message: `Vendor status updated to '${status}' successfully`,
            vendor: safeVendor,
            emailSent: emailSent.success ? "Email sent successfully" : "Email failed to send",
        });

    } catch (error) {
        console.error("Error updating vendor status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


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
            wheelOffer,
            raffleOffer,
            agreedToTerms,
            companyRegistrationCertificateURl,
            vendorIdURl,
            addressProofURl,
            confirmationLetterURl,
            businessPromotionalMaterialURl,
            password,
            referralCodeUsed
        } = req.body;
        console.log("this is the wheel offer ", req.body);

        const existingVendor = await vendorModel.findOne({ businessEmail });
        if (existingVendor) {
            return res.status(400).json({ message: "Partner already exists" });
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
            wheelOffer: {
                type: wheelOffer.type,
                terms: wheelOffer.terms,
                offerings: wheelOffer.offerings.map(offer => ({
                    name: offer.name,
                    quantity: offer.quantity,
                    endDate: offer.endDate,

                }))
            },
            raffleOffer: {
                type: raffleOffer.type,
                terms: raffleOffer.terms,
                offerings: raffleOffer.offerings.map(offer => ({
                    name: offer.name,
                    quantity: offer.quantity,
                    endDate: offer.endDate,

                }))
            },
            agreedToTerms,
            companyRegistrationCertificateURl,
            vendorIdURl,
            addressProofURl,
            confirmationLetterURl,
            businessPromotionalMaterialURl,
            password,
            referralCodeUsed
        });

        if (referralCodeUsed) {
            const referralStatus = await checkCode(referralCodeUsed, newVendor._id);

            if (referralStatus === "invalid") {
                // Remove the just-created vendor if the referral is invalid
                if (newVendor.addressProofURl?.public_id) {
                    console.log(newVendor.addressProofURl.public_id);
                    deleteFile(newVendor.addressProofURl.public_id);
                }

                if (newVendor.companyRegistrationCertificateURl?.public_id) {
                    console.log(newVendor.companyRegistrationCertificateURl.public_id);
                    deleteFile(newVendor.companyRegistrationCertificateURl.public_id);
                }

                if (newVendor.vendorIdURl?.public_id) {
                    console.log(newVendor.vendorIdURl.public_id);
                    deleteFile(newVendor.vendorIdURl.public_id);
                }

                if (newVendor.confirmationLetterURl?.public_id) {
                    console.log(newVendor.confirmationLetterURl.public_id);
                    deleteFile(newVendor.confirmationLetterURl.public_id);
                }

                if (newVendor.businessPromotionalMaterialURl?.public_id) {
                    console.log(newVendor.businessPromotionalMaterialURl.public_id);
                    deleteFile(newVendor.businessPromotionalMaterialURl.public_id);
                }

                await vendorModel.findByIdAndDelete(newVendor._id);
                return res.status(400).json({ message: "Invalid referral code" });
            }

            if (referralStatus === "error") {
                if (newVendor.addressProofURl?.public_id) {
                    console.log(newVendor.addressProofURl.public_id);
                    deleteFile(newVendor.addressProofURl.public_id);
                }

                if (newVendor.companyRegistrationCertificateURl?.public_id) {
                    console.log(newVendor.companyRegistrationCertificateURl.public_id);
                    deleteFile(newVendor.companyRegistrationCertificateURl.public_id);
                }

                if (newVendor.vendorIdURl?.public_id) {
                    console.log(newVendor.vendorIdURl.public_id);
                    deleteFile(newVendor.vendorIdURl.public_id);
                }

                if (newVendor.confirmationLetterURl?.public_id) {
                    console.log(newVendor.confirmationLetterURl.public_id);
                    deleteFile(newVendor.confirmationLetterURl.public_id);
                }

                if (newVendor.businessPromotionalMaterialURl?.public_id) {
                    console.log(newVendor.businessPromotionalMaterialURl.public_id);
                    deleteFile(newVendor.businessPromotionalMaterialURl.public_id);
                }
                await vendorModel.findByIdAndDelete(newVendor._id);
                return res.status(500).json({ message: "Error validating referral code" });
            }
        }


        const vendorResponse = newVendor.toObject();
        delete vendorResponse.password;

        const subject = "🎉 Welcome to The Menu – Let’s Get Your Business Noticed!";
        const message = `
  <p>Dear <b>${newVendor.businessName}</b>,</p>

  <p>You’re officially part of South Africa’s fastest-growing engagement platform. </p>

  <p>Here’s what’s next:</p>
  <ul>
    <li> Log in to your dashboard</li>
    <li> Upload your offers for increased visibility on our Wheel and Raffle platforms</li>
    <li> Await approvals and be part of our raffles or Spin the Wheel</li>
    <li> Track your interactions and visibility</li>
  </ul>

  <p>We’re here to help your business grow – and we don’t take commission.</p>

 <p>
    <a href="https://themenuportal.co.za/vendor/login" style="display: inline-block; background: #DBC166; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 10px;">
      Go and login
    </a>
  </p>

  <p>Thanks for being part of the movement.</p>

  <p>Best regards,<br><b>The Menu Team</b></p>

  <p>Contact: <a href="mailto:support@themenu.co.za">support@themenu.co.za</a><br>
  Website: <a href="https://themenuportal.co.za/">themenuportal.co.za</a></p>
`;


        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "partners@themenuportal.co.za",
        };

        const emailSent = await sendEmail(smtpConfig, newVendor.businessEmail, subject, subject, message);
        res.status(201).json({
            message: "Vendor created successfully",
            vendor: vendorResponse
        });

    } catch (error) {
        console.error("Error registering vendor:", error);


        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: "Validation error",
                errors
            });
        }

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const updateVendorDetails = async (req, res) => {
    try {
        const vendorId = req.params.id;
        const updates = req.body;

        // Remove restricted fields
        const restrictedFields = ['password', 'status', 'vendorTier', 'createdAt', '_id'];
        restrictedFields.forEach(field => {
            if (updates[field]) {
                delete updates[field];
            }
        });

        // Validate email uniqueness if email is being updated
        if (updates.businessEmail) {
            const existingVendor = await vendorModel.findOne({
                businessEmail: updates.businessEmail,
                _id: { $ne: vendorId }
            });

            if (existingVendor) {
                return res.status(400).json({
                    success: false,
                    message: "Business email already in use by another vendor"
                });
            }
        }


        // Handle nested objects properly (especially for socialMediaHandles)
        const updateObject = {};
        for (const key in updates) {
            if (key.includes('.')) {
                // Handle nested fields (like 'wheelOffer.type')
                const [parent, child] = key.split('.');
                if (!updateObject[parent]) {
                    updateObject[parent] = updates[parent] || {};
                }
                updateObject[parent][child] = updates[key];
            } else {
                updateObject[key] = updates[key];
            }
        }

        const updatedVendor = await vendorModel.findByIdAndUpdate(
            vendorId,
            { $set: updateObject },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedVendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        const vendorResponse = updatedVendor.toObject();
        delete vendorResponse.password;

        return res.status(200).json({
            success: true,
            message: "Vendor details updated successfully",
            data: vendorResponse
        });

    } catch (error) {
        console.error("Error updating vendor details:", error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update vendor details",
            error: error.message
        });
    }
};


export const checkVendorEmailExists = async (req, res) => {
    try {
        const { businessEmail } = req.query;

        if (!businessEmail) {
            return res.status(400).json({
                success: false,
                message: "Business email is required as a query parameter"
            });
        }

        const vendor = await vendorModel.findOne({ businessEmail });

        return res.status(200).json({
            success: true,
            exists: !!vendor,
            message: vendor
                ? "Vendor with this email already exists"
                : "Email is available"
        });

    } catch (error) {
        console.error("Error checking vendor email:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



export const forgotPassword = async (req, res) => {
    try {
        const { businessEmail } = req.body;

        if (!businessEmail) {
            return res.status(400).json({ message: "Business email is required" });
        }

        const vendor = await vendorModel.findOne({ businessEmail });

        if (!vendor) {
            // Don't reveal if vendor doesn't exist for security
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been sent"
            });
        }

        // Generate JWT reset token
        const resetToken = generateResetToken(vendor._id);

        // Store token hash in DB (for additional security)
        vendor.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        vendor.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await vendor.save();

        // Create reset URL (use your frontend URL in production)
        const resetUrl = `${process.env.FRONTEND_URL}/vendor/reset-password/${resetToken}`;

        // Email message
        const message = `
        <p>You requested a password reset for your Partners account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `;

        // Send email
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "partners@themenuportal.co.za",
        };

        await sendEmail(
            smtpConfig,
            vendor.businessEmail,
            "Partners Password Reset Request",
            "Reset your password",
            message
        );

        return res.status(200).json({
            success: true,
            message: "Password reset email sent"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            message: "Server error while processing forgot password request",
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET + '-reset');

        // Hash the token to compare with stored one
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const vendor = await vendorModel.findOne({
            _id: decoded.id,
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!vendor) {
            return res.status(400).json({
                message: "Password reset token is invalid or has expired"
            });
        }

        // Set new password
        vendor.password = password;
        vendor.resetPasswordToken = undefined;
        vendor.resetPasswordExpire = undefined;

        await vendor.save();

        // Send confirmation email
        const smtpConfig = {
            host: "mail.themenuportal.co.za",
            port: 465,
            user: "partners@themenuportal.co.za",
        };

        await sendEmail(
            smtpConfig,
            vendor.businessEmail,
            "Partner Password Changed Successfully",
            "Password Update Confirmation",
            `<p>Your Partner account password has been successfully updated.</p>
         <p>If you did not make this change, please contact support immediately.</p>`
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Reset token has expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid reset token" });
        }
        return res.status(500).json({
            message: "Server error while resetting password",
            error: error.message
        });
    }
};