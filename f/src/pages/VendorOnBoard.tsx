import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, Phone, Building2, Package, FileText } from 'lucide-react';
import axios from "axios";
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { CheckCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

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

const provinceCities = {
  "Eastern Cape": ["Gqeberha (Port Elizabeth)", "East London", "Mthatha", "Queenstown", "Grahamstown", "King William’s Town"],
  "Free State": ["Bloemfontein", "Welkom", "Bethlehem", "Sasolburg", "Parys", "Kroonstad"],
  "Gauteng": ["Johannesburg", "Pretoria", "Sandton", "Midrand", "Centurion", "Soweto", "Benoni", "Boksburg", "Kempton Park", "Alberton", "Vanderbijlpark"],
  "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Pinetown", "Umhlanga", "Ballito", "Margate"],
  "Limpopo": ["Polokwane", "Tzaneen", "Mokopane", "Thohoyandou", "Bela-Bela", "Lephalale"],
  "Mpumalanga": ["Mbombela (Nelspruit)", "Witbank (eMalahleni)", "Middelburg", "Secunda", "Barberton", "Sabie"],
  "Northern Cape": ["Kimberley", "Upington", "Springbok", "De Aar", "Kuruman", "Colesberg"],
  "North West": ["Mahikeng", "Rustenburg", "Klerksdorp", "Potchefstroom", "Brits", "Lichtenburg"],
  "Western Cape": ["Cape Town", "Stellenbosch", "George", "Paarl", "Worcester", "Mossel Bay", "Knysna"]
};


interface Offering {
  name: string;
  quantity?: number;
  endDate?: string;
  showQuantity?: boolean;
}

type VendorFormData = {
  businessName: string;
  businessType: string;
  companyRegNumber?: string; // Optional
  vatNumber?: string;
  tradingAddress: string;
  province: string;
  city: string;
  businessContactNumber: string;
  businessEmail: string;
  websiteUrl?: string;

  socialMediaHandles: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };

  representativeName: string;
  representativePosition: string;
  representativeEmail: string;
  representativePhone: string;
  businessDescription?: string;
  wheelOffer: {
    type: string;  // Add type for wheel offers
    offerings: {
      name: string;
      quantity?: number;
      endDate?: string;
      showQuantity?: boolean;
    }[];
    terms: string;
  };
  raffleOffer: {
    type: string;
    offerings: {
      name: string;
      quantity?: number;
      endDate?: string;
      showQuantity?: boolean;
    }[];
    terms: string;
  };


  vendorTier: "bronze" | "silver" | "gold";
  agreedToTerms: boolean;

  companyRegistrationCertificate: File | null,
  vendorId: File | null,
  addressProof: File | null,
  confirmationLetter: File | null,
  businessPromotionalMaterial: File | null,
  password: string,
  confirmPassword: string,
  referralCodeUsed: string

};



function VendorOnboarding() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [CompanyPreview, setCompanyPreview] = useState<File | null>(null);
  const [vendorIdPreview, setVendorIdPreview] = useState<File | null>(null);
  const [addressProofPreview, setAddressProofPreview] = useState<File | null>(null);
  const [confirmationLetterPreview, setConfirmationLetterPreview] = useState<File | null>(null);
  const [businessPromotionalMaterialPreview, setBusinessPromotionalMaterialPreview] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<keyof typeof provinceCities | "">("");
  const isUser = useSelector((state: any) => state.auth.isUserAuthenticated);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<VendorFormData>({
    defaultValues: {
      socialMediaHandles: {},
      wheelOffer: {
        type: "",
        terms: "",
        offerings: [],
      },
      raffleOffer: {
        type: "",
        terms: "",
        offerings: [],
      },
      vendorTier: 'bronze',
      agreedToTerms: false
    }
  });
  // Watch both offerings
  const [wheelOfferingInput, setWheelOfferingInput] = useState("");
  const [raffleOfferingInput, setRaffleOfferingInput] = useState("");

  const wheelOfferings = watch("wheelOffer.offerings") || [];
  const raffleOfferings = watch("raffleOffer.offerings") || [];
  const handleAddOffering = (type: 'wheel' | 'raffle') => {
    const input = type === 'wheel' ? wheelOfferingInput : raffleOfferingInput;
    if (!input.trim()) return;

    const newOffering = {
      name: input.trim(),
      showQuantity: true,
      quantity: undefined,
      endDate: undefined
    };

    if (type === 'wheel') {
      setValue(`wheelOffer.offerings`, [...wheelOfferings, newOffering]);
      setWheelOfferingInput("");
    } else {
      setValue(`raffleOffer.offerings`, [...raffleOfferings, newOffering]);
      setRaffleOfferingInput("");
    }
  };

  const handleRemoveOffering = (index: number, type: 'wheel' | 'raffle') => {
    if (type === 'wheel') {
      const updated = [...wheelOfferings];
      updated.splice(index, 1);
      setValue("wheelOffer.offerings", updated);
    } else {
      const updated = [...raffleOfferings];
      updated.splice(index, 1);
      setValue("raffleOffer.offerings", updated);
    }
  };

  const handleToggleQuantityDate = (index: number, type: 'wheel' | 'raffle') => {
    if (type === 'wheel') {
      const updated = [...wheelOfferings];
      updated[index].showQuantity = !updated[index].showQuantity;
      setValue("wheelOffer.offerings", updated);
    } else {
      const updated = [...raffleOfferings];
      updated[index].showQuantity = !updated[index].showQuantity;
      setValue("raffleOffer.offerings", updated);
    }
  };

  const handleUpdateOffering = (
    index: number,
    type: 'wheel' | 'raffle',
    field: 'quantity' | 'endDate',
    value: string
  ): void => {
    if (type === 'wheel') {
      const updated: Offering[] = [...wheelOfferings];
      if (field === 'quantity') {
        updated[index][field] = value ? parseInt(value) : undefined;
      } else {
        updated[index][field] = value;
      }
      setValue("wheelOffer.offerings", updated);
    } else {
      const updated: Offering[] = [...raffleOfferings];
      if (field === 'quantity') {
        updated[index][field] = value ? parseInt(value) : undefined;
      } else {
        updated[index][field] = value;
      }
      setValue("raffleOffer.offerings", updated);
    }
  };

  const getSignature = async (folder: any) => {
    try {

      const response = await axios.post(`${API_BASE_URL}/generateSignature`, { folder });

      console.log("The signature response is ", response);
      return response.data;
    }
    catch (error) {
      console.error("Error in getting signature for ", folder)
    }
  }

  const makeCloudinaryApiCall = async (data: FormData) => {
    try {
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

      console.log("Uploading to Cloudinary:", data);

      const res = await axios.post(api, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { secure_url, public_id } = res.data;
      console.log("Uploaded File URL:", res.data);

      return { secure_url, public_id };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
    }
  };

  const uploadFile = async (type: string, timestamp: number, signature: string) => {
    let folder: string;
    let file: File | null = null;

    switch (type) {
      case "companyRegistrationCertificate":
        folder = "companyRegistrationCertificate";
        file = CompanyPreview;
        break;
      case "vendorId":
        folder = "vendorId";
        file = vendorIdPreview;
        break;
      case "addressProof":
        folder = "addressProof";
        file = addressProofPreview;
        break;
      case "confirmationLetter":
        folder = "confirmationLetter";
        file = confirmationLetterPreview;
        break;
      case "businessPromotionalMaterial":
        folder = "businessPromotionalMaterial";
        file = businessPromotionalMaterialPreview;
        break;
      default:
        folder = "other-documents";
    }

    if (!file) {
      console.error(`No file selected for ${type}`);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("timestamp", timestamp.toString());
    data.append("signature", signature);
    data.append("api_key", import.meta.env.VITE_CLOUD_API);
    data.append("folder", folder);

    console.log("Uploading to Cloudinary:", data);

    try {
      const result = await makeCloudinaryApiCall(data);
      console.log("Uploaded File URL:", result);
      return result;
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const onSubmit = async (data: VendorFormData) => {
    setLoading(true);

    try {
      const {
        companyRegistrationCertificate,
        vendorId,
        addressProof,
        confirmationLetter,
        businessPromotionalMaterial,
        ...filterData
      } = data;
      const {
        signature: companyRegistrationSignature,
        timestamp: companyRegistrationTimestamp
      } = await getSignature("companyRegistrationCertificate");

      const {
        signature: vendorIdSignature,
        timestamp: vendorIdTimestamp
      } = await getSignature("vendorId");

      const {
        signature: addressProofSignature,
        timestamp: addressProofTimestamp
      } = await getSignature("addressProof");

      const {
        signature: confirmationLetterSignature,
        timestamp: confirmationLetterTimestamp
      } = await getSignature("confirmationLetter");

      const {
        signature: businessPromotionalMaterialSignature,
        timestamp: businessPromotionalMaterialTimestamp
      } = await getSignature("businessPromotionalMaterial");

      const companyRegistrationCertificateURl = await uploadFile(
        "companyRegistrationCertificate",
        companyRegistrationTimestamp,
        companyRegistrationSignature
      );

      const vendorIdURl = await uploadFile(
        "vendorId",
        vendorIdTimestamp,
        vendorIdSignature
      );

      const addressProofURl = await uploadFile(
        "addressProof",
        addressProofTimestamp,
        addressProofSignature
      );

      const confirmationLetterURl = await uploadFile(
        "confirmationLetter",
        confirmationLetterTimestamp,
        confirmationLetterSignature
      );

      const businessPromotionalMaterialURl = await uploadFile(
        "businessPromotionalMaterial",
        businessPromotionalMaterialTimestamp,
        businessPromotionalMaterialSignature
      );

      // Add all URLs to the filtered data object
      const updatedData = {
        ...filterData,
        companyRegistrationCertificateURl,
        vendorIdURl,
        addressProofURl,
        confirmationLetterURl,
        businessPromotionalMaterialURl,
      };

      console.log("The updated data is ", updatedData.vendorIdURl);
      const response = await axios.post(`${API_BASE_URL}/vendor/register`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log(response);
      setLoading(false);
      toast.success("Registration completed successfully! Please wait for approval.");
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100); // Adding a slight delay to ensure navigation completes first
      reset();
    }
    catch (error: any) {
      setLoading(false);
      console.log("Registration error", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };




  return (
    <>
      {isUser ?
        (
          <motion.div
            className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="max-w-md w-full bg-gray-50 rounded-xl p-6 text-center border border-gray-100 shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl font-bold text-[#DBC166] mb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                You're Already Logged In
              </motion.h2>

              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                You are currently logged in as a user. Please log out first if you want to access a different account.
              </motion.p>

              <motion.button
                onClick={() => navigate(-1)}
                className="w-full bg-white border border-[#DBC166] text-[#DBC166] py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Go Back
              </motion.button>
            </motion.div>
          </motion.div>
        )
        : (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <Store className="w-16 h-16 mx-auto mb-4 text-[#C5AD59]" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Partner Registration</h1>
                <p className="text-gray-600">Join our marketplace and start selling your products</p>
              </motion.div>
              <div className='flex justify-between'>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-4"
                >
                  <button
                    onClick={() => { navigate(-1) }}
                    className="px-4 py-2 text-[#C5AD59] border border-[#C5AD59] rounded-md hover:bg-[#C5AD59] hover:text-white transition-all duration-200"
                  >
                    Back
                  </button>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-2 text-gray-600"
                >
                  Already a Partner?{" "}
                  <Link
                    to="/vendor/login"
                    className="text-[#C5AD59] hover:text-[#b39b47] font-semibold transition-colors duration-200"
                  >
                    Login here
                  </Link>
                </motion.p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Business Details Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <Building2 className="w-6 h-6 text-[#C5AD59] mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Business Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        {...register("businessName", { required: "Business name is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                      {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                      <select
                        {...register("businessType", { required: "Business type is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      >
                        <option value="">Select Business Type</option>
                        <option value="restaurants_takeaways">Restaurants & Takeaways</option>
                        <option value="groceries_essentials">Groceries & Essentials</option>
                        <option value="bars_clubs_nightlife">Bars, Clubs & Nightlife</option>
                        <option value="fashion_clothing_accessories">Fashion, Clothing & Accessories</option>
                        <option value="beauty_hair_skincare">Beauty, Hair & Skincare</option>
                        <option value="health_fitness_wellness">Health, Fitness & Wellness</option>
                        <option value="medical_healthcare_services">Medical & Healthcare Services</option>
                        <option value="home_garden_diy">Home, Garden & DIY</option>
                        <option value="electronics_gadgets_appliances">Electronics, Gadgets & Appliances</option>
                        <option value="automotive_transportation">Automotive & Transportation</option>
                        <option value="travel_tourism_hospitality">Travel, Tourism & Hospitality</option>
                        <option value="education_training_skills">Education, Training & Skills Development</option>
                        <option value="professional_business_services">Professional & Business Services</option>
                        <option value="financial_legal_insurance">Financial, Legal & Insurance Services</option>
                        <option value="real_estate_rentals_property">Real Estate, Rentals & Property Services</option>
                        <option value="entertainment_arts_events">Entertainment, Arts & Events</option>
                        <option value="sport_leisure_recreation">Sport, Leisure & Recreation</option>
                        <option value="children_babies_family">Children, Babies & Family</option>
                        <option value="pets_animal_care">Pets & Animal Care</option>
                        <option value="marketing_advertising_media">Marketing, Advertising & Media</option>
                        <option value="industrial_manufacturing_agriculture">Industrial, Manufacturing & Agriculture</option>
                        <option value="traditional_cultural_spiritual">Traditional, Cultural & Spiritual Services</option>
                        <option value="charity_community_social">Charity, Community & Social Welfare</option>
                        <option value="government_public_services">Government & Public Services</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>}
                    </div>





                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Registration Number</label>
                      <input
                        {...register("companyRegNumber")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                      <input
                        {...register("vatNumber")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trading Address</label>
                      <input
                        {...register("tradingAddress", { required: "Trading address is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                      {errors.tradingAddress && <p className="text-red-500 text-sm mt-1">{errors.tradingAddress.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <select {...register("province")} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" onChange={(e: any) => setSelectedProvince(e.target.value)}>
                        <option value="">Select Province</option>
                        {Object.keys(provinceCities).map((province) => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                      {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <select {...register("city")} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" disabled={!selectedProvince}>
                        <option value="">{selectedProvince ? "Select City" : "Select a Province First"}</option>
                        {selectedProvince && provinceCities[selectedProvince].map((city: string) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Contact Number</label>
                      <input
                        {...register("businessContactNumber", { required: "Business contact number is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                      {errors.businessContactNumber && <p className="text-red-500 text-sm mt-1">{errors.businessContactNumber.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Email Address</label>
                      <input
                        {...register("businessEmail", {
                          required: "Business email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                      {errors.businessEmail && <p className="text-red-500 text-sm mt-1">{errors.businessEmail.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                      <input
                        {...register("websiteUrl")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                      <input
                        {...register("socialMediaHandles.facebook")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                      <input
                        {...register("socialMediaHandles.instagram")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                      <input
                        {...register("socialMediaHandles.twitter")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                      <input
                        {...register("socialMediaHandles.tiktok")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Vendor Representative Details Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <Phone className="w-6 h-6 text-[#C5AD59] mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Vendor Representative Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        {...register("representativeName", { required: "Representative name is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                      {errors.representativeName && <p className="text-red-500 text-sm mt-1">{errors.representativeName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position in Business</label>
                      <input
                        {...register("representativePosition", { required: "Representative position is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                      {errors.representativePosition && <p className="text-red-500 text-sm mt-1">{errors.representativePosition.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        {...register("representativeEmail", {
                          required: "Representative email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                      {errors.representativeEmail && <p className="text-red-500 text-sm mt-1">{errors.representativeEmail.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"

                        {...register("representativePhone", {
                          required: "Representative phone number is required",
                          pattern: {
                            value: /^(\+27|0)[6-8][0-9]{8}$/,
                            message: "Enter a valid South African phone number"
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />

                      {errors.representativePhone && <p className="text-red-500 text-sm mt-1">{errors.representativePhone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters long",
                          },
                          validate: {
                            hasUppercase: (value) =>
                              /[A-Z]/.test(value) ||
                              "Password must contain at least one uppercase letter",
                            hasLowercase: (value) =>
                              /[a-z]/.test(value) ||
                              "Password must contain at least one lowercase letter",
                            hasNumber: (value) =>
                              /\d/.test(value) ||
                              "Password must contain at least one number",
                          },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent pr-10"
                      />
                      {/* Show/Hide Password Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === watch("password") || "Passwords do not match",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent pr-10"
                      />
                      {/* Show/Hide Password Button */}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                </motion.div>

                {/* Business Offerings & Exclusive Deals Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <Package className="w-6 h-6 text-[#C5AD59] mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Business Offerings & Exclusive Deals</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brief Business Description</label>
                      <textarea
                        {...register("businessDescription")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                      />
                    </div>

                    {/* Wheel Offerings Section */}
                    <div className="md:col-span-2 border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Wheel Offerings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Offering Type</label>
                          <select
                            {...register("wheelOffer.type", { required: "Wheel offer type is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                          >
                            <option value="">Select a wheel offer type</option>
                            {offers.map((offer: string, index: number) => (
                              <option key={index} value={offer}>
                                {offer}
                              </option>
                            ))}
                          </select>
                          {errors.wheelOffer?.type && (
                            <p className="text-red-500 text-sm mt-1">Please select the wheel offerings</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Products/Services for Wheel</label>
                          <div className="flex gap-2">
                            <input
                              value={wheelOfferingInput}
                              onChange={(e) => setWheelOfferingInput(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                              placeholder="Enter a product or service"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddOffering('wheel')}
                              className="px-4 py-2 bg-[#C5AD59] text-white rounded-md hover:bg-[#b39b47] transition-colors duration-200"
                            >
                              Add
                            </button>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Current Wheel Offerings:</p>
                            {wheelOfferings.length === 0 ? (
                              <p className="text-sm text-gray-500">No wheel offerings added yet</p>
                            ) : (
                              <div className="space-y-2">
                                {wheelOfferings.map((offering: any, index: number) => (
                                  <div key={index} className="bg-gray-50 p-2 rounded-md space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-700 font-semibold">{offering.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveOffering(index, 'wheel')}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        Remove
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleToggleQuantityDate(index, 'wheel')}
                                      className="w-full bg-gray-200 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                                    >
                                      {offering.showQuantity ? "Switch to Date Range" : "Switch to Quantity"}
                                    </button>

                                    {offering.showQuantity ? (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Quantity (Optional)
                                        </label>
                                        <input
                                          type="number"
                                          value={offering.quantity || ""}
                                          onChange={(e) =>
                                            handleUpdateOffering(index, 'wheel', "quantity", e.target.value)
                                          }
                                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          End Date
                                        </label>
                                        <input
                                          type="date"
                                          value={offering.endDate || ""}
                                          min={new Date().toISOString().split("T")[0]}
                                          onChange={(e) => {
                                            const selectedDate = new Date(e.target.value);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            if (selectedDate < today) {
                                              alert("End date cannot be in the past");
                                              return;
                                            }

                                            handleUpdateOffering(index, 'wheel', "endDate", e.target.value);
                                          }}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Offer Terms</label>
                          <textarea
                            {...register("wheelOffer.terms", { required: "Wheel offer terms are required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                          />
                          {errors.wheelOffer?.terms && <p className="text-red-500 text-sm mt-1">{errors.wheelOffer.terms.message}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Raffle Offerings Section */}
                    <div className="md:col-span-2 border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Raffle Offerings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Raffle Offering Type</label>
                          <select
                            {...register("raffleOffer.type", { required: "Raffle offer type is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                          >
                            <option value="">Select a raffle offer type</option>
                            {offers.map((offer: string, index: number) => (
                              <option key={index} value={offer}>
                                {offer}
                              </option>
                            ))}
                          </select>
                          {errors.raffleOffer?.type && (
                            <p className="text-red-500 text-sm mt-1">Please select the raffle offerings</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Products/Services for Raffle</label>
                          <div className="flex gap-2">
                            <input
                              value={raffleOfferingInput}
                              onChange={(e) => setRaffleOfferingInput(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                              placeholder="Enter a product or service"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddOffering('raffle')}
                              className="px-4 py-2 bg-[#C5AD59] text-white rounded-md hover:bg-[#b39b47] transition-colors duration-200"
                            >
                              Add
                            </button>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Current Raffle Offerings:</p>
                            {raffleOfferings.length === 0 ? (
                              <p className="text-sm text-gray-500">No raffle offerings added yet</p>
                            ) : (
                              <div className="space-y-2">
                                {raffleOfferings.map((offering: any, index: number) => (
                                  <div key={index} className="bg-gray-50 p-2 rounded-md space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-700 font-semibold">{offering.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveOffering(index, 'raffle')}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        Remove
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleToggleQuantityDate(index, 'raffle')}
                                      className="w-full bg-gray-200 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                                    >
                                      {offering.showQuantity ? "Switch to Date Range" : "Switch to Quantity"}
                                    </button>

                                    {offering.showQuantity ? (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          Quantity (Optional)
                                        </label>
                                        <input
                                          type="number"
                                          value={offering.quantity || ""}
                                          onChange={(e) =>
                                            handleUpdateOffering(index, 'raffle', "quantity", e.target.value)
                                          }
                                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                          End Date
                                        </label>
                                        <input
                                          type="date"
                                          value={offering.endDate || ""}
                                          min={new Date().toISOString().split("T")[0]}
                                          onChange={(e) => {
                                            const selectedDate = new Date(e.target.value);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            if (selectedDate < today) {
                                              alert("End date cannot be in the past");
                                              return;
                                            }

                                            handleUpdateOffering(index, 'raffle', "endDate", e.target.value);
                                          }}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Raffle Offer Terms</label>
                          <textarea
                            {...register("raffleOffer.terms", { required: "Raffle offer terms are required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                          />
                          {errors.raffleOffer?.terms && <p className="text-red-500 text-sm mt-1">{errors.raffleOffer.terms.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* document uploads */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 mr-2 text-[#C5AD59]" />
                    <h2 className="text-2xl font-semibold text-gray-800">Required Documents
                    </h2>
                  </div>

                  {/* company register detail */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Registration Certificate (PDF)
                    </label>

                    <div
                      className="relative flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        {...register("companyRegistrationCertificate", {
                          required: "Company Registration Certificate is required",
                          validate: (fileList: any) => {

                            if (!fileList || fileList.length === 0) return "File is required";
                            const file = fileList[0];
                            if (file.type !== "application/pdf") return "Only PDF files are allowed";
                            if (file.size > 20 * 1024 * 1024) {
                              return "File size must be under 20MB"; // This only shows during form submission
                            }
                            return true;
                          },
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 20 * 1024 * 1024) {
                              toast.error("File size must be under 20MB"); // Now shows immediately
                              setCompanyPreview(null); // Reset preview if invalid
                              setValue("companyRegistrationCertificate", null); // Reset form value
                              return;
                            }

                            if (file.type === "application/pdf") {
                              setCompanyPreview(file);
                            } else {
                              setCompanyPreview(null);
                              setValue("companyRegistrationCertificate", null);
                            }
                          }
                        }}
                      />

                      <span className="text-gray-600">Click to upload or drag & drop</span>
                    </div>

                    {/* PDF Preview */}
                    {CompanyPreview && (
                      <div className="mt-3 flex items-center space-x-3">
                        <span className="text-gray-700">{CompanyPreview.name}</span>

                        <a
                          href={URL.createObjectURL(CompanyPreview)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm hover:underline"
                        >
                          View PDF
                        </a>

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="text-red-500 text-sm hover:underline"
                          onClick={() => {
                            setCompanyPreview(null); // Remove preview
                            setValue("companyRegistrationCertificate", null); // Clear from React Hook Form
                            // Reset the file input value
                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Error Message */}
                    {errors.companyRegistrationCertificate && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyRegistrationCertificate.message}</p>
                    )}
                  </div>


                  {/* Partner ID Upload */}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner Id (PDF)</label>

                    {/* Upload Box */}
                    <div className="relative flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
                      <input
                        type="file"
                        accept=".pdf"
                        {...register("vendorId", {
                          required: "Partner Id is required",
                          validate: (fileList: any) => {
                            if (!fileList || fileList.length === 0) return "File is required";
                            const file = fileList[0];
                            if (file.type !== "application/pdf") return "Only PDF files are allowed";
                            if (file.size > 20 * 1024 * 1024) return "File size must be under 20MB";
                            return true;
                          },
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 20 * 1024 * 1024) {
                              toast.error("File size must be under 20MB"); // Now shows immediately
                              setVendorIdPreview(null); // Reset preview if invalid
                              setValue("vendorId", null); // Reset form value
                              return;
                            }
                            if (file && file.type === "application/pdf" && file.size <= 20 * 1024 * 1024) {
                              setVendorIdPreview(file);
                            } else {
                              setVendorIdPreview(null); // Reset preview if invalid file
                              setValue("vendorId", null); // Reset value if invalid file
                            }
                          }

                        }}
                      />
                      <span className="text-gray-600">Click to upload or drag & drop</span>
                    </div>

                    {/* PDF Preview */}
                    {vendorIdPreview && (
                      <div className="mt-3 flex items-center space-x-3">
                        <span className="text-gray-700">{vendorIdPreview.name}</span>

                        <a
                          href={URL.createObjectURL(vendorIdPreview)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm hover:underline"
                        >
                          View PDF
                        </a>

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="text-red-500 text-sm hover:underline"
                          onClick={() => {
                            setVendorIdPreview(null); // Remove preview
                            setValue("vendorId", null); // Clear from React Hook Form
                            // Reset the file input value
                            const fileInput = document.querySelectorAll('input[type="file"]')[1] as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Error Message */}
                    {errors.vendorId && <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>}
                  </div>

                  {/* Address Proof */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Proof (PDF)</label>
                    <div className="relative flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
                      <input
                        type="file"
                        accept=".pdf"
                        {...register("addressProof", {
                          required: "Address Proof is required",
                          validate: (fileList: any) => {
                            if (!fileList || fileList.length === 0) return "File is required";
                            const file = fileList[0];
                            if (file.type !== "application/pdf") return "Only PDF files are allowed";
                            if (file.size > 20 * 1024 * 1024) return "File size must be under 20MB";
                            return true;
                          },
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 20 * 1024 * 1024) {
                              toast.error("File size must be under 20MB"); // Now shows immediately
                              setAddressProofPreview(null); // Reset preview if invalid
                              setValue("addressProof", null); // Reset form value
                              return;
                            }
                            if (file && file.type === "application/pdf" && file.size <= 20 * 1024 * 1024) {
                              setAddressProofPreview(file);
                            } else {
                              setAddressProofPreview(null); // Reset preview if invalid file
                              setValue("addressProof", null); // Reset value if invalid file
                            }
                          }

                        }}
                      />
                      <span className="text-gray-600">Click to upload or drag & drop</span>
                    </div>

                    {/* PDF Preview */}
                    {addressProofPreview && (
                      <div className="mt-3 flex items-center space-x-3">
                        <span className="text-gray-700">{addressProofPreview.name}</span>

                        <a
                          href={URL.createObjectURL(addressProofPreview)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm hover:underline"
                        >
                          View PDF
                        </a>

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="text-red-500 text-sm hover:underline"
                          onClick={() => {
                            setAddressProofPreview(null); // Remove preview
                            setValue("addressProof", null); // Clear from React Hook Form
                            // Reset the file input value
                            const fileInput = document.querySelectorAll('input[type="file"]')[2] as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Error Message */}
                    {errors.addressProof && <p className="text-red-500 text-sm mt-1">{errors.addressProof.message}</p>}
                  </div>

                  {/* Confirmation Letter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Confirmation Letter (PDF)</label>
                    <div className="relative flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
                      <input
                        type="file"
                        accept=".pdf"
                        {...register("confirmationLetter", {
                          validate: (fileList: any) => {
                            if (!fileList || fileList.length === 0) return true; // Allow empty as it seems optional based on original code
                            const file = fileList[0];
                            if (file.type !== "application/pdf") return "Only PDF files are allowed";
                            if (file.size > 20 * 1024 * 1024) return "File size must be under 20MB";
                            return true;
                          },
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 20 * 1024 * 1024) {
                              toast.error("File size must be under 20MB"); // Now shows immediately
                              setConfirmationLetterPreview(null); // Reset preview if invalid
                              setValue("confirmationLetter", null); // Reset form value
                              return;
                            }
                            if (file && file.type === "application/pdf" && file.size <= 20 * 1024 * 1024) {
                              setConfirmationLetterPreview(file);
                            } else {
                              setConfirmationLetterPreview(null); // Reset preview if invalid file
                              setValue("confirmationLetter", null); // Reset value if invalid file
                            }
                          }
                        }}
                      />
                      <span className="text-gray-600">Click to upload or drag & drop</span>
                    </div>

                    {/* PDF Preview */}
                    {confirmationLetterPreview && (
                      <div className="mt-3 flex items-center space-x-3">
                        <span className="text-gray-700">{confirmationLetterPreview.name}</span>

                        <a
                          href={URL.createObjectURL(confirmationLetterPreview)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm hover:underline"
                        >
                          View PDF
                        </a>

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="text-red-500 text-sm hover:underline"
                          onClick={() => {
                            setConfirmationLetterPreview(null); // Remove preview
                            setValue("confirmationLetter", null); // Clear from React Hook Form
                            // Reset the file input value
                            const fileInput = document.querySelectorAll('input[type="file"]')[3] as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Error Message */}
                    {errors.confirmationLetter && <p className="text-red-500 text-sm mt-1">{errors.confirmationLetter.message}</p>}
                  </div>

                  {/* Business Promotional Material */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
                    <div className="relative flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
                      <input
                        type="file"
                        accept="image/*"
                        {...register("businessPromotionalMaterial", { required: "Business Promotional Material is required" })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setBusinessPromotionalMaterialPreview(file);
                          }
                        }}
                      />
                      <span className="text-gray-600">Click to upload or drag & drop</span>
                    </div>
                    {businessPromotionalMaterialPreview && (
                      <div className="mt-3 flex items-center space-x-3">
                        <img src={URL.createObjectURL(businessPromotionalMaterialPreview)} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                        <Button
                          type="button"
                          className="text-red-500 text-sm hover:underline"
                          onClick={() => {
                            setBusinessPromotionalMaterialPreview(null);
                            setValue("businessPromotionalMaterial", null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    {errors.businessPromotionalMaterial && <p className="text-red-500 text-sm mt-1">{errors.businessPromotionalMaterial.message}</p>}
                  </div>

                </motion.div>



                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-[#C5AD59] mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Enter Referral Code (if any)
                    </h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referral Code Used
                    </label>
                    <input
                      {...register("referralCodeUsed")}
                      type="text"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#C5AD59] outline-none"
                    />
                  </div>

                </motion.div>

                {/* Agreement Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-[#C5AD59] mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Agreement</h2>
                  </div>

                  <button onClick={() => setShowModal(true)} className="text-blue-500 underline">
                    Read Terms & Conditions
                  </button>
                  <br />
                  <a href='/docs/vendorTerm.pdf' download="vendorTerm.pdf" className="text-blue-500 underline">
                    Download
                  </a>

                  <label className="flex items-center mt-2">
                    <input type="checkbox" {...register("agreedToTerms", { required: "You must agree to the terms and conditions" })} className="mr-2" />
                    <span className="text-gray-700">I agree to the Partner terms and conditions</span>
                  </label>
                  {errors.agreedToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms.message}</p>}
                </motion.div>

                {/* Terms Modal */}
                {showModal && (

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
                      <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>

                      <div className="max-h-80 overflow-y-auto p-4 border border-gray-300 rounded-md text-sm leading-relaxed space-y-4">
                        <h1 className="text-2xl font-bold text-center mb-4">The Menu Vendor Agreement</h1>
                        <p className="text-gray-700 mb-4">This Vendor Agreement ("Agreement") is entered into by and between:</p>
                        <p className="text-gray-700"><strong>The Menu ("The Company"):</strong> A company registered in the Republic of South Africa.</p>
                        <p className="text-gray-700 mb-4"><strong>The Vendor ("Vendor"):</strong> Whose details are set out in the signature section below.</p>

                        <h2 className="text-xl font-semibold mt-6">1. Definitions and Interpretation</h2>
                        <p className="text-gray-700">"The Menu": The digital marketing and promotions platform owned and operated by The Company.</p>
                        <p className="text-gray-700">"Vendor": The business listing products or services on The Menu.</p>
                        <p className="text-gray-700">"Exclusive Offers": Promotions offered solely to The Menu users.</p>
                        <p className="text-gray-700 mb-4">"POPIA": Protection of Personal Information Act, South Africa.</p>

                        <h2 className="text-xl font-semibold mt-6">2. Vendor Onboarding and Fees</h2>
                        <ul className="list-disc list-inside text-gray-700">
                          <li>Vendors joining during the Beta Testing period will onboard for free.</li>
                          <li>After Beta Testing, a one-time, non-refundable setup fee of R5 000.00 applies.</li>
                          <li>All listing and advertisement fees are final and non-refundable.</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6">3. Vendor Tier Structure and Obligations</h2>
                        <table className="w-full mt-4 border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border border-gray-300 p-2">Tier</th>
                              <th className="border border-gray-300 p-2">Requirements</th>
                              <th className="border border-gray-300 p-2">Incentives</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 p-2">Bronze</td>
                              <td className="border border-gray-300 p-2">1 exclusive deal per month, 90% positive rating</td>
                              <td className="border border-gray-300 p-2">10% ad slots, basic analytics</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-2">Silver</td>
                              <td className="border border-gray-300 p-2">3 exclusive offers, 1 giveaway per month</td>
                              <td className="border border-gray-300 p-2">20% ad slots, advanced analytics</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-2">Gold</td>
                              <td className="border border-gray-300 p-2">5 exclusive offers, 1 giveaway per week</td>
                              <td className="border border-gray-300 p-2">70% ad slots, premium analytics</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <button onClick={() => setShowModal(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Close
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  type="submit"
                  disabled={Loading}
                  className={`w-full py-3 px-6 rounded-md transition-colors duration-200 font-semibold text-lg shadow-md
    ${Loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#C5AD59] hover:bg-[#b39b47] text-white"}`}
                >
                  {Loading ? "Submitting..." : "Submit Registration"}
                </motion.button>
              </form>
            </div>
          </div >
        )}
    </>

  );
}

export default VendorOnboarding;