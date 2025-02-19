import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, Phone, Building2, Package } from 'lucide-react';
import axios from "axios";

type VendorFormData = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  offerings: string[];
};

function VendorOnboarding() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VendorFormData>({
    defaultValues: {
      offerings: []
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
      const response = await axios.post("http://localhost:8000/api/vendor/register", data);
      console.log("Vendor Registered Successfully:", response.data);
      const vendorId = response.data.vendor._id;
      console.log(vendorId);
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-4"
        >
          <button
            onClick={() => {navigate('/')}}
            className="px-4 py-2 text-[#C5AD59] border border-[#C5AD59] rounded-md hover:bg-[#C5AD59] hover:text-white transition-all duration-200"
          >
            Back
          </button>
        </motion.div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  {...register("contactPerson", { required: "Contact person is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 text-[#C5AD59] mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <input
                  {...register("address", { required: "Address is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Offerings Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              <Package className="w-6 h-6 text-[#C5AD59] mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Product Offerings</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Product Offering</label>
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
                {errors.offerings && <p className="text-red-500 text-sm mt-1">{errors.offerings.message}</p>}
              </div>
            </div>
          </motion.div>

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