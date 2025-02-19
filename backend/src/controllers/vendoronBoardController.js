import vendorModel from "../models/vendor.model.js";
import { generateToken } from "../utils/generateToken.js";
// the vendor is being register
export const registerVendor = async (req, res) => {
    try {
        const { businessName, contactPerson, email, phone, address, offerings } = req.body;

        const existingVendor = await vendorModel.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: "Vendor with this email already exists." });
        }

        const newVendor = await vendorModel.create({
            businessName,
            contactPerson,
            email,
            phone,
            address,
            offerings,
            status: "Pending",
            role: "vendor",
        });
        const detailForToken = { id: newVendor._id, role: newVendor.role }; //we use vendor id for authorization and role  Authenticate 
        const token = generateToken(detailForToken);
        if (newVendor || token)
            res.status(201).json({ message: "Vendor registered successfully!", vendor: newVendor, token });
    } catch (error) {
        console.error("Error registering vendor:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get all vendors
export const getVendors = async (req, res) => {
    try {
        const vendors = await vendorModel.find();
        res.status(200).json(vendors);
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

export const updateVendorStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedVendor = await vendorModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json({ message: "Vendor status updated", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor status:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
export const updateVendorDetails = async (req, res) => {
    try {
        const { businessName, contactPerson, email, phone, address, offerings } = req.body;
        
        const updatedVendor = await vendorModel.findByIdAndUpdate(
            req.params.id,
            { businessName, contactPerson, email, phone, address, offerings },
            { new: true, runValidators: true }
        );
        
        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        
        res.status(200).json({ message: "Vendor details updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor details:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};