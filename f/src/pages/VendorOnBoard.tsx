import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, Phone, Building2, Package, CheckCircle, FileText } from 'lucide-react';
import axios from "axios";
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

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
  offerings: string[];

  exclusiveOffer: {
    type: "online" | "in-store";
    details: string;
    terms: string;
  },

  vendorTier: "bronze" | "silver" | "gold";
  agreedToTerms: boolean;

  companyRegistrationCertificate: File | null,
  vendorId: File | null,
  addressProof: File | null,
  confirmationLetter: File | null,
  businessPromotionalMaterial: File | null,
  password: string,
  confirmPassword: string

};

function VendorOnboarding() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [Loading, setLoading] = useState<boolean>(false);
  const [CompanyPreview, setCompanyPreview] = useState<File | null>(null);
  const [vendorIdPreview, setVendorIdPreview] = useState<File | null>(null);
  const [addressProofPreview, setAddressProofPreview] = useState<File | null>(null);
  const [confirmationLetterPreview, setConfirmationLetterPreview] = useState<File | null>(null);
  const [businessPromotionalMaterialPreview, setBusinessPromotionalMaterialPreview] = useState<File | null>(null);
  const [offeringInput, setOfferingInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const offerings = watch('offerings');

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

      const { secure_url } = res.data;
      console.log("Uploaded File URL:", secure_url);

      return secure_url;
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
      const secure_url = await makeCloudinaryApiCall(data);
      console.log("Uploaded File URL:", secure_url);
      return secure_url;
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
      } = data; // Filtered form data

      //check for existing user
      const existingUser = await axios.post(`${API_BASE_URL}/checkUser`, {
        "email": data.businessEmail,
        "modelName": "vendorModel"
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (existingUser.data.existingUser) {
        toast.error("User with this email already exist");
        return;
      }
      else {
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


        const response = await axios.post(`${API_BASE_URL}/vendor/register`, updatedData, {
          headers: {
            "Content-Type": "application/json",
          }
        });
        console.log(response);
        setLoading(false);
        toast.success("Registration completed successfully! Please wait for approval.");
      }

    }
    catch (error: any) {
      setLoading(false);
      console.log("Registration error", error);
      toast.error("Something is wrong! Please try again later");
    }


  };

  const handleAddOffering = () => {
    if (offeringInput.trim()) {
      setValue('offerings', [...offerings, offeringInput.trim()]);
      setOfferingInput('');
    }
  };

  const handleRemoveOffering = (index: number) => {
    setValue('offerings', offerings.filter((_, i) => i !== index));
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Promotional Material</label>
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
            disabled={Loading}
            className={`w-full py-3 px-6 rounded-md transition-colors duration-200 font-semibold text-lg shadow-md
    ${Loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#C5AD59] hover:bg-[#b39b47] text-white"}`}
          >
            {Loading ? "Submitting..." : "Submit Registration"}
          </motion.button>
        </form>
      </div>
    </div >
  );
}

export default VendorOnboarding;