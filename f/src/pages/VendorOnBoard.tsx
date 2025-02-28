import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, Phone, Building2, Package, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import axios from "axios";

type VendorFormData = {
  businessName: string;
  businessType: string;
  companyRegNumber?: string;
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
  businessDescription: string;
  offerings: string[];
  exclusiveOffer: {
    type: 'online' | 'in-store';
    details: string;
    terms: string;
  };
  vendorTier: 'bronze' | 'silver' | 'gold';
  agreedToTerms: boolean;
};

function VendorOnboarding() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showModal, setShowModal] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VendorFormData>({
    defaultValues: {
      offerings: [],
      socialMediaHandles: {},
      exclusiveOffer: {
        type: 'online',
        details: '',
        terms: ''
      },
      vendorTier: 'bronze',
      agreedToTerms: false
    }
  });

  const [offeringInput, setOfferingInput] = React.useState('');
  const offerings = watch('offerings');


  const handleAddOffering = () => {
    if (offeringInput.trim()) {
      setValue('offerings', [...offerings, offeringInput.trim()]);
      setOfferingInput('');
    }
  };

  const handleRemoveOffering = (index: number) => {
    setValue('offerings', offerings.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: VendorFormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/register`, data);
      console.log("Vendor Registered Successfully:", response.data);
      const vendorId = response.data.vendor._id;
      localStorage.setItem("VendorToken", response.data?.token);
      navigate(`/vendor/dashboard/${vendorId}`);
    } catch (error: any) {
      console.error("Error Registering Vendor:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Store className="w-16 h-16 mx-auto mb-4 text-[#C5AD59]" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Vendor Registration</h1>
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
              onClick={() => { navigate('/') }}
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
            Already a vendor?{" "}
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
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail</option>
                  <option value="service">Service</option>
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
                <select
                  {...register("province", { required: "Province is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                >
                  <option value="gauteng">Gauteng</option>
                  <option value="western-cape">Western Cape</option>
                  <option value="kwaZulu-natal">KwaZulu-Natal</option>
                </select>
                {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  {...register("city", { required: "City is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                >
                  <option value="johannesburg">Johannesburg</option>
                  <option value="cape-town">Cape Town</option>
                  <option value="durban">Durban</option>
                </select>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
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
                  {...register("representativePhone", { required: "Representative phone number is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.representativePhone && <p className="text-red-500 text-sm mt-1">{errors.representativePhone.message}</p>}
              </div>
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
                  {...register("businessDescription", { required: "Business description is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.businessDescription && <p className="text-red-500 text-sm mt-1">{errors.businessDescription.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Products/Services Offered</label>
                <div className="flex gap-2">
                  <input
                    value={offeringInput}
                    onChange={(e) => setOfferingInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                    placeholder="Enter a product or service"
                  />
                  <button
                    type="button"
                    onClick={handleAddOffering}
                    className="px-4 py-2 bg-[#C5AD59] text-white rounded-md hover:bg-[#b39b47] transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Offerings:</p>
                  {offerings.length === 0 ? (
                    <p className="text-sm text-gray-500">No offerings added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {offerings.map((offering, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <span className="text-gray-700">{offering}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveOffering(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exclusive Offer Type</label>
                <select
                  {...register("exclusiveOffer.type", { required: "Offer type is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                >
                  <option value="online">Online Offer</option>
                  <option value="in-store">In-Store Offer</option>
                </select>
                {errors.exclusiveOffer?.type && <p className="text-red-500 text-sm mt-1">{errors.exclusiveOffer.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Details</label>
                <input
                  {...register("exclusiveOffer.details", { required: "Offer details are required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.exclusiveOffer?.details && <p className="text-red-500 text-sm mt-1">{errors.exclusiveOffer.details.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Terms</label>
                <textarea
                  {...register("exclusiveOffer.terms", { required: "Offer terms are required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.exclusiveOffer?.terms && <p className="text-red-500 text-sm mt-1">{errors.exclusiveOffer.terms.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Vendor Tier Selection Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-[#C5AD59] mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Vendor Tier Selection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Tier</label>
                <select
                  {...register("vendorTier", { required: "Vendor tier is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
                {errors.vendorTier && <p className="text-red-500 text-sm mt-1">{errors.vendorTier.message}</p>}
              </div>
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
            <a href="/vendorTerm.docx" download className="text-blue-500 underline">
              Download
            </a>

            <label className="flex items-center mt-2">
              <input type="checkbox" {...register("agreedToTerms", { required: "You must agree to the terms and conditions" })} className="mr-2" />
              <span className="text-gray-700">I agree to the Vendor terms and conditions</span>
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
            className="w-full bg-[#C5AD59] text-white py-3 px-6 rounded-md hover:bg-[#b39b47] transition-colors duration-200 font-semibold text-lg shadow-md"
          >
            Submit Registration
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default VendorOnboarding;