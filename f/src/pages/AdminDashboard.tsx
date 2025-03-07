import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Users,
  Menu,
  X,
  LogOut,
  PackageCheck,
  UserPlus,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import CustomDatePicker from '@/components/customComponents/Datepicker';
export interface IVendor {
  _id: string;
  businessName: string;
  businessType: string;
  companyRegNumber: string;
  vatNumber?: string;
  tradingAddress: string;
  province?: string;
  city?: string;
  status: "pending" | "approved" | "rejected";
  businessContactNumber: string;
  businessEmail: string;
  websiteUrl?: string;
  socialMediaHandles?: Record<string, string>;
  representativeName: string;
  representativePosition: string;
  representativeEmail: string;
  representativePhone: string;
  businessDescription?: string;
  offerings?: string[];
  exclusiveOffer: {
    type: string;
    details?: string;
    terms?: string;
  };
  password: string;
  vendorTier: "bronze" | "silver" | "gold";
  agreedToTerms: boolean;
  companyRegistrationCertificateURl?: string;
  vendorIdURl?: string | undefined;
  addressProofURl?: string | undefined;
  confirmationLetterURl?: string | undefined;
  businessPromotionalMaterialURl?: string | undefined;
}

interface Affiliated {
  _id: string;
  fullName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  type: "individual" | "business";
  businessName?: string | null;
  companyRegistrationNumber?: string | null;
  vatNumber?: string | null;
  tradingAddress?: string | null;
  provinceCity?: string | null;
  businessContactNumber?: string | null;
  businessEmailAddress?: string | null;
  password: string;
  status: "pending" | "approved" | "rejected";
  promotionChannels?: ("Social Media" | "Email Marketing" | "Influencer Partnerships" | "Offline Events" | "Other")[];
  socialMediaPlatforms?: string[];
  otherPromotionMethod?: string | null;
  targetAudience?: string | null;
}

interface NewAdmin {
  username: string;
  email: string;
  password: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [affiliates, setAffiliates] = useState<Affiliated[]>([]);
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const adminToken = localStorage.getItem("AdminToken");
  const [error, setError] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [isManageAffiliate, setManageAffiliate] = useState(false);
  const [isManagePartner, setManagePartner] = useState(false);

  const [isManageWeeklyReferral, setManageWeeklyReferral] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCreateAdminModalOpen, setCreateAdminModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    username: '',
    email: '',
    password: ''
  });
  const [hasSelectedOption, setHasSelectedOption] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("AdminToken");
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const fetchAffiliate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/affiliated`);
      setAffiliates(res.data.data);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch affiliates');
      setIsLoading(false);
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const fetchVendor = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendor/allDetails`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      setVendors(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchWeeklyReferral = async () => {

  }
  const switchTab = (tab: 'affiliate' | 'partner' | 'weeklyReferral') => {
    if (tab === 'affiliate') {
      setManageAffiliate(true);
      setManagePartner(false);
      setManageWeeklyReferral(false);
      setHasSelectedOption(true);
      fetchAffiliate();
    } else if (tab === 'partner') {
      setManageAffiliate(false);
      setManagePartner(true);
      setManageWeeklyReferral(false);
      setHasSelectedOption(true);
      fetchVendor();
    } else {
      setManageAffiliate(false);
      setManagePartner(false);
      setManageWeeklyReferral(true);
      setHasSelectedOption(true);
      fetchWeeklyReferral();
    }
  };

  const updateAffiliate = async (id: string, status: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true })); // Start loading for this affiliate
    try {
      const payload = { id, status };
      const response = await axios.put(
        `${API_BASE_URL}/affiliated/updateStatus`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Ensure we maintain the full structure of the Affiliate object
      setAffiliates(prevAffiliates =>
        prevAffiliates.map((affiliate): Affiliated => {
          if (affiliate._id === id) {
            return { ...affiliate, status: status as "pending" | "approved" | "rejected" };
          }
          return affiliate;
        })
      );

      console.log(response)
      toast.success("Status updated successfully");
    } catch (error: any) {
      console.error("Error updating affiliate status:", error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false })); // Stop loading
    }
  };

  const updatePartnerStatus = async (id: string, status: "pending" | "approved" | "rejected") => {

    setLoadingStates(prev => ({ ...prev, [id]: true })); // Start loading for this partner

    try {
      const payload = { id, status };
      await axios.put(
        `${API_BASE_URL}/vendor/updateStatus`, // Adjusted endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Update partner status in state
      setVendors(prevPartners =>
        prevPartners.map((partner): IVendor => {
          if (partner._id === id) {
            return { ...partner, status };
          }
          return partner;
        })
      );


      toast.success("Partner status updated successfully");
    } catch (error: any) {
      console.error("Error updating partner status:", error.message);
      toast.error("Failed to update status");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false })); // Stop loading
    }
  };


  const handleClickAffiliate = () => {
    switchTab('affiliate');
  };

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3 } },
    closed: { x: "-100%", transition: { duration: 0.3 } }
  };

  const contentVariants = {
    sidebarOpen: { marginLeft: "250px", transition: { duration: 0.3 } },
    sidebarClosed: { marginLeft: "0px", transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Sidebar - uses fixed positioning on larger screens, sliding drawer on mobile */}
      <motion.div
        className="fixed h-full w-64 bg-white shadow-lg z-20 md:z-10 top-0 left-0"
        variants={sidebarVariants}
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManageAffiliate ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={handleClickAffiliate}
          >
            <Users size={20} className="mr-3" />
            <span>Manage Affiliates</span>
          </div>

          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManagePartner ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => switchTab('partner')}
          >
            <PackageCheck size={20} className="mr-3" />
            <span>Manage Partners</span>
          </div>

          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManageWeeklyReferral ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => switchTab('weeklyReferral')}
          >
            <Calendar size={20} className="mr-3" />
            <span>Manage Weekly Referral</span>
          </div>
        </nav>
      </motion.div>

      {/* Overlay for mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <motion.div
        className="flex-1 bg-gray-50 w-full"
        variants={contentVariants}
        initial="sidebarOpen"
        animate={isSidebarOpen ? "sidebarOpen" : "sidebarClosed"}
      >
        {/* Navbar */}
        <div className="bg-white h-16 shadow-sm flex items-center justify-between px-4">
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="px-2 py-1 md:px-4 md:py-2 bg-[#DBC166] text-white rounded-md flex items-center text-xs md:text-base"
              onClick={() => setCreateAdminModalOpen(true)}
            >
              <UserPlus size={16} className="mr-1 md:mr-2" />
              <span className="hidden xs:inline">Create Admin</span>
            </button>
            <button
              className="px-2 py-1 md:px-4 md:py-2 bg-red-500 text-white rounded-md flex items-center text-xs md:text-base"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1 md:mr-2" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-3 md:p-6 overflow-x-hidden">
          {!hasSelectedOption && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Please select an option to manage.</p>
            </div>
          )}

          {isManageAffiliate && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6">Manage Affiliates</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DBC166]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {affiliates.map(affiliate => (
                    <div key={affiliate._id} className="bg-white rounded-lg shadow p-4 md:p-6 text-sm md:text-base">
                      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 break-words">{affiliate.fullName} {affiliate.surname}</h3>
                      <p className="text-gray-600 mb-2 break-words"><strong>Email:</strong> {affiliate.email}</p>
                      <p className="text-gray-600 mb-2"><strong>Phone:</strong> {affiliate.phoneNumber}</p>
                      <p className="text-gray-600 mb-2">
                        <strong>Type:</strong>
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${affiliate.type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {affiliate.type}
                        </span>
                      </p>
                      {affiliate.type === 'business' && (
                        <div className="mt-2">
                          <p className="text-gray-600 mb-2 break-words"><strong>Business Name:</strong> {affiliate.businessName}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Reg Number:</strong> {affiliate.companyRegistrationNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>VAT Number:</strong> {affiliate.vatNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Address:</strong> {affiliate.tradingAddress}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>City:</strong> {affiliate.provinceCity}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Business Phone:</strong> {affiliate.businessContactNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Business Email:</strong> {affiliate.businessEmailAddress}</p>
                        </div>
                      )}
                      <p className="text-gray-600 mb-2 break-words"><strong>Promotion:</strong> {affiliate.promotionChannels?.join(', ')}</p>
                      <p className="text-gray-600 mb-2 break-words"><strong>Social Media:</strong> {affiliate.socialMediaPlatforms?.join(', ')}</p>
                      <p className="text-gray-600 mb-2 break-words"><strong>Other Promotion:</strong> {affiliate.otherPromotionMethod}</p>
                      <p className="text-gray-600 mb-2 break-words"><strong>Target Audience:</strong> {affiliate.targetAudience}</p>

                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {affiliate.status === "approved" ? (
                          <span className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md text-sm">Approved</span>
                        ) : (
                          <Button
                            onClick={() => updateAffiliate(affiliate._id, "approved")}
                            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm ${loadingStates[affiliate._id] ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            disabled={loadingStates[affiliate._id]}
                          >
                            {loadingStates[affiliate._id] ? "Approving..." : "Approve"}
                          </Button>
                        )}

                        {affiliate.status !== "approved" && (
                          <Button
                            onClick={() => updateAffiliate(affiliate._id, "rejected")}
                            className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm ${loadingStates[affiliate._id] ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            disabled={loadingStates[affiliate._id]}
                          >
                            {loadingStates[affiliate._id] ? "Rejecting..." : "Reject"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {isManagePartner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6">Manage Partners</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DBC166]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {vendors.map((vendor) => (
                    <motion.div
                      key={vendor._id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md border border-gray-200 text-sm md:text-base"
                    >
                      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 break-words">{vendor.businessName}</h2>
                      <p className="text-gray-600 break-words">{vendor.businessType}</p>
                      <p className="text-gray-500 break-words">Reg No: {vendor.companyRegNumber}</p>
                      <p className="text-gray-500 break-words">VAT No: {vendor.vatNumber}</p>
                      <p className="text-gray-500 break-words">Address: {vendor.tradingAddress}</p>
                      <p className="text-gray-500 break-words">
                        Location: {vendor.city}, {vendor.province}
                      </p>
                      <p className="text-gray-500 break-words">Email: {vendor.businessEmail}</p>
                      <p className="text-gray-500 break-words">Contact: {vendor.businessContactNumber}</p>
                      <p className="text-gray-500 break-words">
                        Website: <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Visit</a>
                      </p>

                      <h3 className="mt-3 md:mt-4 font-semibold">Representative:</h3>
                      <p className="break-words">{vendor.representativeName} ({vendor.representativePosition})</p>
                      <p className="break-words">Email: {vendor.representativeEmail}</p>
                      <p className="break-words">Phone: {vendor.representativePhone}</p>

                      <h3 className="mt-3 md:mt-4 font-semibold">Exclusive Offer:</h3>
                      <p className="break-words">Type: {vendor.exclusiveOffer?.type}</p>
                      <p className="break-words">Details: {vendor.exclusiveOffer?.details}</p>
                      <p className="break-words">Terms: {vendor.exclusiveOffer?.terms}</p>

                      <h3 className="mt-3 md:mt-4 font-semibold">Social Media:</h3>
                      <div className="flex flex-wrap gap-2">
                        <a href={vendor.socialMediaHandles?.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Facebook</a>
                        <a href={vendor.socialMediaHandles?.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 underline">Instagram</a>
                        <a href={vendor.socialMediaHandles?.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Twitter</a>
                        <a href={vendor.socialMediaHandles?.tiktok} target="_blank" rel="noopener noreferrer" className="text-black underline">TikTok</a>
                      </div>

                      <h3 className="mt-3 md:mt-4 font-semibold">Documents:</h3>
                      <div className="bg-white rounded-xl py-2 mb-2">
                        <ul className="list-none space-y-2">
                          {vendor.companyRegistrationCertificateURl && (
                            <li>
                              <a
                                href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.companyRegistrationCertificateURl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Company Registration Certificate
                              </a>
                            </li>
                          )}

                          {vendor.vendorIdURl && (
                            <li>
                              <a
                                href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.vendorIdURl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Vendor ID
                              </a>
                            </li>
                          )}

                          {vendor.addressProofURl && (
                            <li>
                              <a
                                href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.addressProofURl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Address Proof
                              </a>
                            </li>
                          )}

                          {vendor.confirmationLetterURl && (
                            <li>
                              <a
                                href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.confirmationLetterURl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Confirmation Letter
                              </a>
                            </li>
                          )}

                          <li>
                            <a
                              href={vendor.businessPromotionalMaterialURl + "#toolbar=0"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              Business Promotional Material
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
                        <Button
                          onClick={() => updatePartnerStatus(vendor._id, "approved")}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 text-sm"
                        >
                          {vendor.status === "approved" ? "Approved" : "Approve"}
                        </Button>

                        {vendor.status !== "approved" && (
                          <Button
                            onClick={() => updatePartnerStatus(vendor._id, "rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 text-sm"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {isManageWeeklyReferral && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6">Manage Raff:</h2>
             
              <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
              <p className="mt-4 text-lg font-medium">
                Selected Date & Time:{" "}
                <span className="text-green-400">{selectedDate?.toLocaleString()}</span>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Create Admin Modal */}
      {isCreateAdminModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg w-full max-w-md p-4 md:p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold">Create New Admin</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setCreateAdminModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* create new admin form */}
            <form onSubmit={() => { }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-3 py-1 md:px-4 md:py-2 border text-gray-700 rounded-md hover:bg-gray-100 text-sm md:text-base"
                  onClick={() => setCreateAdminModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 md:px-4 md:py-2 bg-[#DBC166] text-white rounded-md hover:bg-[#c9a94c] text-sm md:text-base"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;