import { useState, useEffect } from "react";
import { LogOut, Settings, User, CreditCard, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { vendorLogout } from "@/store/authSlice";



const offers = [
  "Discount Vouchers",
  "Buy One, Get One Free",
  "Cashback Rewards",
  "Service Discounts",
  "Exclusive Deals for Members",
  "Retail Gift Vouchers (Lower Value)",
  "Entertainment Offers",
  "Food & Beverage Offers",
  "Limited Stock Offers",
  "Limited-Time Flash Deals",
  "Luxury Experiences",
  "High-Value Gift Cards",
  "Exclusive VIP Packages",
  "Premium Travel Packages",
  "Electronics & Gadgets",
  "Large Cashback Offers",
  "Major Service Packages",
  "Luxury Fashion & Accessories",
  "Home & Appliance Giveaways",
  "Supercar or House Giveaways"
];


interface Offering {
  name: string;
  quantity?: number;
  endDate?: string;
}

interface Offer {
  type: string;
  offerings: Offering[];
  terms: string;
}

interface VendorFormData {
  _id: string;
  businessName: string;
  businessType: string;
  companyRegNumber: string;
  vatNumber: string;
  tradingAddress: string;
  province: string;
  city: string;
  businessContactNumber: string;
  businessEmail: string;
  websiteUrl: string;
  representativeName: string;
  representativePosition: string;
  representativeEmail: string;
  representativePhone: string;
  businessDescription: string;
  socialMediaHandles?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  vendorTier: string;
  status: string;
  wheelOffer?: Offer;
  raffleOffer?: Offer;
  companyRegistrationCertificateURl: {
    public_id: string;
    secure_url: string;
  };
  vendorIdURl?: {
    public_id: string;
    secure_url: string;
  };
  addressProofURl?: {
    public_id: string;
    secure_url: string;
  };
  confirmationLetterURl?: {
    public_id: string;
    secure_url: string;
  };
  businessPromotionalMaterialURl?: {
    public_id?: string;
    secure_url?: string;
  };
  password: string;
  confirmPassword: string;
}

// Define the structure for provinces and cities
interface Province {
  name: string;
  cities: string[];
}

// List of South African provinces and cities
const southAfricanProvinces: Province[] = [
  {
    name: "Eastern Cape",
    cities: ["Gqeberha (Port Elizabeth)", "East London", "Mthatha", "Queenstown", "Grahamstown", "King William’s Town"],
  },
  {
    name: "Free State",
    cities: ["Bloemfontein", "Welkom", "Bethlehem", "Sasolburg", "Parys", "Kroonstad"],
  },
  {
    name: "Gauteng",
    cities: ["Johannesburg", "Pretoria", "Sandton", "Midrand", "Centurion", "Soweto", "Benoni", "Boksburg", "Kempton Park", "Alberton", "Vanderbijlpark"],
  },
  {
    name: "KwaZulu-Natal",
    cities: ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Pinetown", "Umhlanga", "Ballito", "Margate"],
  },
  {
    name: "Limpopo",
    cities: ["Polokwane", "Tzaneen", "Mokopane", "Thohoyandou", "Bela-Bela", "Lephalale"],
  },
  {
    name: "Mpumalanga",
    cities: ["Mbombela (Nelspruit)", "Witbank (eMalahleni)", "Middelburg", "Secunda", "Barberton", "Sabie"],
  },
  {
    name: "Northern Cape",
    cities: ["Kimberley", "Upington", "Springbok", "De Aar", "Kuruman", "Colesberg"],
  },
  {
    name: "North West",
    cities: ["Mahikeng", "Rustenburg", "Klerksdorp", "Potchefstroom", "Brits", "Lichtenburg"],
  },
  {
    name: "Western Cape",
    cities: ["Cape Town", "Stellenbosch", "George", "Paarl", "Worcester", "Mossel Bay", "Knysna"],
  },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [vendor, setVendor] = useState<VendorFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<VendorFormData> | any>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const navigate = useNavigate();
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("VendorToken");
    dispatch(vendorLogout());
    navigate('/');
  };

  const fetchVendorData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/vendor/${id}`);
      setVendor(res.data);
      setFormData(res.data);
      console.log(res.data);
      if (res.data.province) {
        const selectedProvince = southAfricanProvinces.find((p) => p.name === res.data.province);
        if (selectedProvince) {
          setCities(selectedProvince.cities);
        }
      }
      setHasFetched(true);
    } catch (error) {
      console.log("Error fetching vendor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "province") {
      const selectedProvince = southAfricanProvinces.find((p) => p.name === value);
      if (selectedProvince) {
        setCities(selectedProvince.cities);
      }
      setFormData({
        ...formData,
        [name]: value,
        city: "", // Reset city when province changes
      });
    } else if (name.startsWith("social.")) {
      const socialField = name.split(".")[1];
      setFormData({
        ...formData,
        socialMediaHandles: {
          ...formData.socialMediaHandles || {},
          [socialField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUpdateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("The form data is ", formData);
    const { wheelOffer } = formData;
    console.log(wheelOffer);
    if (cooldownActive) {
      Math.floor(cooldownTime / 60);
      cooldownTime % 60;
      return;
    }

    setIsLoading(true);
    try {
      const { wheelOffer } = formData;
      console.log(wheelOffer);

      console.log("Updating wheel...");
      await axios.put(`${API_BASE_URL}/wheel/${id}/exclusive-offer`, {
        wheelOffer,
      });
      await axios.put(`${API_BASE_URL}/vendor/update/${id}`, formData);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      setCooldownActive(true);
      setCooldownTime(300);
      const countdownInterval = setInterval(() => {
        setCooldownTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(countdownInterval);
            setCooldownActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      console.log("Error updating vendor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchVendorData();
    }
  }, []);

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      },
    },
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const navItemVariants = {
    hover: { x: 5, backgroundColor: "rgba(229, 231, 235, 0.5)" },
    tap: { scale: 0.95 },
  };

  const handleInputChange1 = (
    e: any,
    offerType: 'wheelOffer' | 'raffleOffer',
    offeringIndex?: number,
    fieldName?: keyof Offering | keyof Offer
  ) => {
    const { value } = e.target;

    setFormData((prev: any) => {
      // Create a deep copy of the previous state
      const newData = { ...prev };

      // Initialize the offer if it doesn't exist
      if (!newData[offerType]) {
        newData[offerType] = {
          type: '',
          offerings: [],
          terms: ''
        };
      }

      // Handle nested offering fields
      if (offeringIndex !== undefined && fieldName && newData[offerType]) {
        const updatedOfferings = [...(newData[offerType]?.offerings || [])];

        // Initialize the offering if it doesn't exist
        if (!updatedOfferings[offeringIndex]) {
          updatedOfferings[offeringIndex] = { name: '' };
        }

        // Update the specific field
        updatedOfferings[offeringIndex] = {
          ...updatedOfferings[offeringIndex],
          [fieldName]: fieldName === 'quantity' ? (value === '' ? undefined : Number(value)) : value
        };

        newData[offerType] = {
          ...newData[offerType],
          offerings: updatedOfferings
        };
      }
      // Handle direct offer fields (type, terms)
      else if (fieldName && newData[offerType]) {
        newData[offerType] = {
          ...newData[offerType],
          [fieldName]: value
        };
      }

      return newData;
    });
  };

  const handleCreateNewOffer = (offerType: 'wheelOffer' | 'raffleOffer') => {
    setFormData((prev: any) => ({
      ...prev,
      [offerType]: {
        type: '',
        offerings: [{ name: '' }],
        terms: ''
      }
    }));
  };

  const handleAddOffering = (offerType: 'wheelOffer' | 'raffleOffer') => {
    setFormData((prev: any) => ({
      ...prev,
      [offerType]: {
        ...prev[offerType],
        offerings: [
          ...(prev[offerType]?.offerings || []),
          { name: '' }
        ]
      }
    }));
  };

  const handleDeleteOffering = (offerType: 'wheelOffer' | 'raffleOffer', index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [offerType]: {
        ...prev[offerType],
        offerings: (prev[offerType]?.offerings || []).filter((_: any, i: any) => i !== index)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <motion.header
        className="bg-white shadow-sm z-10"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <motion.button
              onClick={toggleSidebar}
              className="md:hidden mr-2 p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
            <motion.h1
              className="text-xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Vendor Dashboard
            </motion.h1>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </motion.button>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 768) && (
            <motion.aside
              className="bg-white shadow-md md:w-64 w-72 fixed md:static inset-y-0 left-0 md:translate-x-0 z-20 overflow-y-auto"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <nav className="px-2 py-4 space-y-1">
                <motion.button
                  onClick={() => handleTabChange("profile")}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === "profile" ? "bg-[#DBC166] text-black" : "text-gray-600"
                    }`}
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <User className="h-5 w-5 mr-3" />
                  Update profile
                </motion.button>

                <motion.button
                  onClick={() => handleTabChange("payment")}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === "payment" ? "bg-[#DBC166] text-black" : "text-gray-600"
                    }`}
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Payments
                </motion.button>

                <motion.button
                  onClick={() => handleTabChange("settings")}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${activeTab === "settings" ? "bg-[#DBC166] text-black" : "text-gray-600"
                    }`}
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </motion.button>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 md:hidden z-10"
              onClick={toggleSidebar}
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 z-0">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="bg-white shadow rounded-lg p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <AnimatePresence mode="wait">
                {/* Profile Section */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {cooldownActive && (
                      <div className="mt-2 text-sm text-orange-600">
                        Update cooldown: {Math.floor(cooldownTime / 60)}:{cooldownTime % 60 < 10 ? '0' + (cooldownTime % 60) : cooldownTime % 60}
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                      <h2 className="flex items-center space-x-3 text-lg font-medium text-gray-900">
                        <img
                          src={vendor?.businessPromotionalMaterialURl?.secure_url}
                          alt="profile"
                          height={48}
                          width={48}
                          className="rounded-full w-12 h-12 object-cover border border-gray-300 shadow-sm"
                        />
                        <span>{vendor?.businessName || "Vendor Name"}</span>
                      </h2>

                      {vendor && (
                        <div className="flex items-center">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${vendor.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : vendor.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                              }`}
                          >
                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          </span>
                          <span className="ml-2 px-3 py-1 bg[#DBC166] text-black rounded-full text-sm font-semibold">
                            {vendor.vendorTier.charAt(0).toUpperCase() + vendor.vendorTier.slice(1)} Tier
                          </span>
                        </div>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : vendor ? (
                      <>

                        <form onSubmit={handleUpdateVendor} className="space-y-6">
                          {updateSuccess && (
                            <motion.div
                              className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              Vendor information updated successfully!
                            </motion.div>
                          )}

                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <p className="text-sm text-black">
                              You can update your business information below. Document uploads are not available for editing
                              in this interface.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-md font-medium text-gray-700 mb-4">Business Information</h3>

                              <div className="space-y-4">
                                <div>
                                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                                    Business Name
                                  </label>
                                  <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                                    Business Type
                                  </label>
                                  <input
                                    type="text"
                                    id="businessType"
                                    name="businessType"
                                    value={formData.businessType || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="companyRegNumber" className="block text-sm font-medium text-gray-700">
                                    Company Registration Number
                                  </label>
                                  <input
                                    type="text"
                                    id="companyRegNumber"
                                    name="companyRegNumber"
                                    value={formData.companyRegNumber || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
                                    VAT Number
                                  </label>
                                  <input
                                    type="text"
                                    id="vatNumber"
                                    name="vatNumber"
                                    value={formData.vatNumber || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-md font-medium text-gray-700 mb-4">Contact Information</h3>

                              <div className="space-y-4">
                                <div>
                                  <label htmlFor="tradingAddress" className="block text-sm font-medium text-gray-700">
                                    Trading Address
                                  </label>
                                  <input
                                    type="text"
                                    id="tradingAddress"
                                    name="tradingAddress"
                                    value={formData.tradingAddress || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                                      Province
                                    </label>
                                    <select
                                      id="province"
                                      name="province"
                                      value={formData.province || ""}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                      <option value="">Select Province</option>
                                      {southAfricanProvinces.map((province) => (
                                        <option key={province.name} value={province.name}>
                                          {province.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                      City
                                    </label>
                                    <select
                                      id="city"
                                      name="city"
                                      value={formData.city || ""}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                      disabled={!formData.province}
                                    >
                                      <option value="">Select City</option>
                                      {cities.map((city) => (
                                        <option key={city} value={city}>
                                          {city}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor="businessContactNumber" className="block text-sm font-medium text-gray-700">
                                    Business Contact Number
                                  </label>
                                  <input
                                    type="text"
                                    id="businessContactNumber"
                                    name="businessContactNumber"
                                    value={formData.businessContactNumber || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700">
                                    Business Email
                                  </label>
                                  <input
                                    type="email"
                                    id="businessEmail"
                                    name="businessEmail"
                                    value={formData.businessEmail || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                              <h3 className="text-md font-medium text-gray-700 mb-4">Representative Information</h3>

                              <div className="space-y-4">
                                <div>
                                  <label htmlFor="representativeName" className="block text-sm font-medium text-gray-700">
                                    Representative Name
                                  </label>
                                  <input
                                    type="text"
                                    id="representativeName"
                                    name="representativeName"
                                    value={formData.representativeName || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="representativePosition" className="block text-sm font-medium text-gray-700">
                                    Representative Position
                                  </label>
                                  <input
                                    type="text"
                                    id="representativePosition"
                                    name="representativePosition"
                                    value={formData.representativePosition || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="representativeEmail" className="block text-sm font-medium text-gray-700">
                                    Representative Email
                                  </label>
                                  <input
                                    type="email"
                                    id="representativeEmail"
                                    name="representativeEmail"
                                    value={formData.representativeEmail || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="representativePhone" className="block text-sm font-medium text-gray-700">
                                    Representative Phone
                                  </label>
                                  <input
                                    type="text"
                                    id="representativePhone"
                                    name="representativePhone"
                                    value={formData.representativePhone || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-md font-medium text-gray-700 mb-4">Online Presence</h3>

                              <div className="space-y-4">
                                <div>
                                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                                    Website URL
                                  </label>
                                  <input
                                    type="url"
                                    id="websiteUrl"
                                    name="websiteUrl"
                                    value={formData.websiteUrl || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="social.facebook" className="block text-sm font-medium text-gray-700">
                                    Facebook
                                  </label>
                                  <input
                                    type="url"
                                    id="social.facebook"
                                    name="social.facebook"
                                    value={formData.socialMediaHandles?.facebook || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="social.instagram" className="block text-sm font-medium text-gray-700">
                                    Instagram
                                  </label>
                                  <input
                                    type="url"
                                    id="social.instagram"
                                    name="social.instagram"
                                    value={formData.socialMediaHandles?.instagram || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="social.twitter" className="block text-sm font-medium text-gray-700">
                                    Twitter
                                  </label>
                                  <input
                                    type="url"
                                    id="social.twitter"
                                    name="social.twitter"
                                    value={formData.socialMediaHandles?.twitter || ""}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <h3 className="text-md font-medium text-gray-700 mb-4">Business Details</h3>

                            <div className="space-y-4">
                              <div>
                                <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
                                  Business Description
                                </label>
                                <textarea
                                  id="businessDescription"
                                  name="businessDescription"
                                  rows={4}
                                  value={formData.businessDescription || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>

                              <div>
                                {/* Wheel Offer Section */}
                                {formData.wheelOffer ? (
                                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Wheel Offer</h4>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Offer Type
                                        </label>
                                        <select
                                          value={formData.wheelOffer.type}
                                          onChange={(e) => handleInputChange1(e, 'wheelOffer', undefined, 'type')}
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                          required
                                        >
                                          {offers.map((offer: any, index: any) => (
                                            <option key={index} value={offer}>
                                              {offer}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Terms & Conditions
                                        </label>
                                        <textarea
                                          rows={2}
                                          value={formData.wheelOffer.terms}
                                          onChange={(e) => handleInputChange1(e, 'wheelOffer', undefined, 'terms')}
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                          Offerings
                                        </label>

                                        {formData.wheelOffer.offerings.map((offering: any, index: any) => (
                                          <div key={`wheel-${index}`} className="space-y-2 mb-4">
                                            <input
                                              type="text"
                                              placeholder="Name"
                                              value={offering.name}
                                              onChange={(e) => handleInputChange1(e, 'wheelOffer', index, 'name')}
                                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />

                                            <input
                                              type="number"
                                              placeholder="Quantity"
                                              required
                                              value={offering.quantity || ''}
                                              onChange={(e) => handleInputChange1(e, 'wheelOffer', index, 'quantity')}
                                              onKeyDown={(e) => {
                                                // Prevent negative numbers, decimal points, and non-numeric characters
                                                if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              min="1"
                                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />

                                            <input
                                              type="date"
                                              placeholder="End Date"
                                              value={offering.endDate || ''}
                                              onChange={(e) => {
                                                const selectedDate = new Date(e.target.value);
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);

                                                if (selectedDate >= today) {
                                                  handleInputChange1(e, 'wheelOffer', index, 'endDate');
                                                } else {
                                                  // Optionally show an error message or reset the value
                                                  e.target.value = '';
                                                }
                                              }}
                                              min={new Date().toISOString().split('T')[0]} // Set min date to today
                                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />

                                            <button
                                              type="button"
                                              onClick={() => handleDeleteOffering('wheelOffer', index)}
                                              className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        ))}

                                        <button
                                          type="button"
                                          onClick={() => handleAddOffering('wheelOffer')}
                                          className="mt-2 bg-[#DBC166] text-white py-1 px-3 rounded-md hover:scale-3d"
                                        >
                                          Add Offering
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Create Wheel Offer</h4>
                                    <button
                                      type="button"
                                      onClick={() => handleCreateNewOffer('wheelOffer')}
                                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                    >
                                      Create Wheel Offer
                                    </button>
                                  </div>
                                )}

                                {/* Raffle Offer Section */}
                                {formData.raffleOffer ? (
                                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Raffle Offer</h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                      ⚠ Caution: If the offer is already on raffle, updating will create a new one.
                                    </p>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Offer Type
                                        </label>
                                        <select
                                          value={formData.wheelOffer.type}
                                          onChange={(e) => handleInputChange1(e, 'wheelOffer', undefined, 'type')}
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                          required
                                        >
                                          {offers.map((offer: any, index: any) => (
                                            <option key={index} value={offer}>
                                              {offer}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Terms & Conditions
                                        </label>
                                        <textarea
                                          rows={2}
                                          value={formData.raffleOffer.terms}
                                          onChange={(e) => handleInputChange1(e, 'raffleOffer', undefined, 'terms')}
                                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                          Offerings
                                        </label>

                                        {formData.raffleOffer.offerings.map((offering: any, index: any) => (
                                          <div key={`raffle-${index}`} className="space-y-2 mb-4">
                                            <input
                                              type="text"
                                              placeholder="Name"
                                              value={offering.name}
                                              onChange={(e) => handleInputChange1(e, 'raffleOffer', index, 'name')}
                                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />

                                            <input
                                              type="number"
                                              placeholder="Quantity"
                                              value={offering.quantity || ''}
                                              onChange={(e) => handleInputChange1(e, 'raffleOffer', index, 'quantity')}
                                              onKeyDown={(e) => {
                                                // Prevent negative numbers, decimal points, and non-numeric characters
                                                if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              min="1"
                                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />

                                            <input
                                              type="date"
                                              placeholder="End Date"
                                              value={offering.endDate || ''}
                                              onChange={(e) => {
                                                const selectedDate = new Date(e.target.value);
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);

                                                if (selectedDate >= today) {
                                                  handleInputChange1(e, 'raffleOffer', index, 'endDate');
                                                } else {
                                                  // Update the state with empty value
                                                  handleInputChange1(e, 'raffleOffer', index, 'endDate');
                                                }
                                              }}
                                              min={new Date().toISOString().split('T')[0]}
                                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />

                                            <button
                                              type="button"
                                              onClick={() => handleDeleteOffering('raffleOffer', index)}
                                              className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          type="button"
                                          onClick={() => handleAddOffering('raffleOffer')}
                                          className="mt-2 bg-[#DBC166] text-white py-1 px-3 rounded-md hover:scale-3d"
                                        >
                                          Add Offering
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Create Raffle Offer</h4>
                                    <button
                                      type="button"
                                      onClick={() => handleCreateNewOffer('raffleOffer')}
                                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                    >
                                      Create Raffle Offer
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>





                          </div>

                          <div className="pt-4">
                            <div className="flex justify-end">
                              <motion.button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm mb-2 text-white bg-[#DBC166] hover:bg-[#C0AC5B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DBC166]"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                              >
                                Save Changes
                              </motion.button>

                            </div>
                          </div>
                        </form>

                        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">partner Documents</h3>
                          <ul className="list-none space-y-3">
                            {vendor.companyRegistrationCertificateURl && (
                              <li>
                                <a
                                  href={
                                    vendor.companyRegistrationCertificateURl.secure_url.endsWith(".pdf")
                                      ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.companyRegistrationCertificateURl.secure_url)}`
                                      : vendor.companyRegistrationCertificateURl.secure_url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition duration-200 text-sm"
                                >
                                  📄 <span>Company Registration Certificate</span>
                                </a>
                              </li>
                            )}

                            {vendor.vendorIdURl && (
                              <li>
                                <a
                                  href={
                                    vendor.vendorIdURl.secure_url.endsWith(".pdf")
                                      ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.vendorIdURl.secure_url)}`
                                      : vendor.vendorIdURl.secure_url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition duration-200 text-sm"
                                >
                                  🆔 <span>Partner ID</span>
                                </a>
                              </li>
                            )}

                            {vendor.addressProofURl && (
                              <li>
                                <a
                                  href={
                                    vendor.addressProofURl.secure_url.endsWith(".pdf")
                                      ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.addressProofURl.secure_url)}`
                                      : vendor.addressProofURl.secure_url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition duration-200 text-sm"
                                >
                                  📜 <span>Address Proof</span>
                                </a>
                              </li>
                            )}

                            {vendor.confirmationLetterURl && (
                              <li>
                                <a
                                  href={
                                    vendor.confirmationLetterURl.secure_url.endsWith(".pdf")
                                      ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.confirmationLetterURl.secure_url)}`
                                      : vendor.confirmationLetterURl.secure_url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition duration-200 text-sm"
                                >
                                  📝 <span>Confirmation Letter</span>
                                </a>
                              </li>
                            )}

                            {vendor.businessPromotionalMaterialURl && (
                              <li>
                                <a
                                  href={vendor.businessPromotionalMaterialURl.secure_url + "#toolbar=0"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition duration-200 text-sm"
                                >
                                  🎨 <span>Business Promotional Material</span>
                                </a>
                              </li>
                            )}
                          </ul>

                        </div>

                      </>

                    ) : (
                      <div className="text-center text-gray-600">No partner data found.</div>
                    )}
                  </motion.div>
                )}

                {/* Payments Section */}
                {activeTab === "payment" && (
                  <motion.div
                    key="payment"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Payments</h2>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <p className="text-gray-600">Payment information and history will be displayed here(coming soon).</p>
                    </div>
                  </motion.div>
                )}

                {/* Settings Section */}
                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Settings</h2>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <p className="text-gray-600">Settings and preferences will be managed here(coming soon).</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;