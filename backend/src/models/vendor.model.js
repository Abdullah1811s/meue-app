import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  offerings: { type: [String], required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  role: { type: String, default: "vendor" },
}, { timestamps: true });

export default mongoose.model('Vendor', VendorSchema);
