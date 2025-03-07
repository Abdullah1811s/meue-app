import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaFilePdf, FaEnvelope, FaPhone, FaGlobe, FaUser, FaBuilding } from 'react-icons/fa';

const ManagePartner = () => {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    const [vendors, setVendors] = useState<any[]>([]);
    const [hasFetched, setHasFetched] = useState(false);
    const adminToken = localStorage.getItem("AdminToken");

    const fetchData = async () => {
        try {
            const response = await axios.get(`${base_url}/vendor/allDetails`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setVendors(response.data);
            setHasFetched(true);
        } catch (error: any) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        if (!hasFetched) {
            fetchData();
        }
    }, [hasFetched]);

    const handleApprove = (vendorId: string) => {
        console.log(`Approved vendor with ID: ${vendorId}`);
    };

    const handleReject = (vendorId: string) => {
        console.log(`Rejected vendor with ID: ${vendorId}`);
    };

    // Animation variants for Framer Motion
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Partners</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor, index) => (
                    <motion.div
                        key={vendor._id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        className="border p-4 rounded-lg shadow-md bg-white"
                    >
                        <h2 className="text-xl font-semibold flex items-center">
                            <FaBuilding className="mr-2" /> {vendor.businessName}
                        </h2>
                        <p className="mt-2"><strong><FaUser className="inline mr-2" />Business Type:</strong> {vendor.businessType}</p>
                        <p><strong><FaFilePdf className="inline mr-2" />Company Registration Number:</strong> {vendor.companyRegNumber}</p>
                        <p><strong><FaFilePdf className="inline mr-2" />VAT Number:</strong> {vendor.vatNumber}</p>
                        <p><strong><FaBuilding className="inline mr-2" />Trading Address:</strong> {vendor.tradingAddress}, {vendor.city}, {vendor.province}</p>
                        <p><strong><FaPhone className="inline mr-2" />Contact Number:</strong> {vendor.businessContactNumber}</p>
                        <p><strong><FaEnvelope className="inline mr-2" />Email:</strong> {vendor.businessEmail}</p>
                        <p><strong><FaGlobe className="inline mr-2" />Website:</strong> <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">{vendor.websiteUrl}</a></p>
                        <p><strong>Social Media:</strong></p>
                        <ul className="list-disc list-inside">
                            <li><a href={vendor.socialMediaHandles.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500">Facebook</a></li>
                            <li><a href={vendor.socialMediaHandles.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500">Instagram</a></li>
                            <li><a href={vendor.socialMediaHandles.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500">Twitter</a></li>
                            <li><a href={vendor.socialMediaHandles.tiktok} target="_blank" rel="noopener noreferrer" className="text-blue-500">TikTok</a></li>
                        </ul>
                        <p><strong><FaUser className="inline mr-2" />Representative Name:</strong> {vendor.representativeName}</p>
                        <p><strong><FaUser className="inline mr-2" />Representative Position:</strong> {vendor.representativePosition}</p>
                        <p><strong><FaEnvelope className="inline mr-2" />Representative Email:</strong> {vendor.representativeEmail}</p>
                        <p><strong><FaPhone className="inline mr-2" />Representative Phone:</strong> {vendor.representativePhone}</p>
                        <p><strong>Business Description:</strong> {vendor.businessDescription}</p>
                        <p><strong>Offerings:</strong> {vendor.offerings.join(', ')}</p>
                        <p><strong>Vendor Tier:</strong> {vendor.vendorTier}</p>
                        <p><strong>Agreed to Terms:</strong> {vendor.agreedToTerms ? 'Yes' : 'No'}</p>

                        {/* PDF Files */}
                        <div className="mt-4">
                            <h3 className="font-semibold"><FaFilePdf className="inline mr-2" />Documents:</h3>
                            <ul className="list-disc list-inside">
                                <li>
                                    <a href={vendor.companyRegistrationCertificateURl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Company Registration Certificate
                                    </a>
                                </li>
                                <li>
                                    <a href={vendor.vendorIdURl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Vendor ID
                                    </a>
                                </li>
                                <li>
                                    <a href={vendor.addressProofURl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Address Proof
                                    </a>
                                </li>
                                <li>
                                    <a href={vendor.confirmationLetterURl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Confirmation Letter
                                    </a>
                                </li>
                                <li>
                                    <a href={vendor.businessPromotionalMaterialURl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Business Promotional Material
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Approve and Reject Buttons */}
                        <div className="mt-4 flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApprove(vendor._id)}
                                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                <FaCheck /> Approve
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReject(vendor._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                <FaTimes /> Reject
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ManagePartner;