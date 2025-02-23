import { Check, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Navbar from '../components/customComponents/DashBoardNavbar';
import { Sidebar } from '../components/customComponents/Sidebar';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Define the schema
const businessSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  contact_person: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  offerings: z.array(z.string()).min(1, 'At least one offering is required'),
});

// Infer TypeScript type
type BusinessFormData = z.infer<typeof businessSchema>;

function VendorProfile() {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const [initialData, setInitialData] = useState<Partial<BusinessFormData> | null>(null);
  const [offeringInput, setOfferingInput] = useState('');
  const [offerings, setOfferings] = useState<string[]>(initialData?.offerings || []);
  // React Hook Form Setup
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BusinessFormData>();

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/vendor/${id}`);
        setInitialData(response.data);

        // Populate form fields with fetched data
        if (response.data) {
          Object.keys(response.data).forEach((key) => {
            setValue(key as keyof BusinessFormData, response.data[key]);
          });
        }
      } catch (error) {
        toast.error('Failed to fetch vendor data');
        console.error('Error fetching vendor data:', error);
      }
    };

    if (id) {
      fetchVendorData();
    }
  }, [id, setValue]);

  const onSubmit = async (data: BusinessFormData) => {
    try {
      console.log("Submitting form...");
      const token = localStorage.getItem("VendorToken");
      if (!token) {
        toast.error("Unauthorized: No token found");
        return;
      }

      await axios.put(
        `${API_BASE_URL}/vendor/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };


  const handleAddOffering = () => {
    if (offeringInput.trim()) {
      const newOfferings = [...offerings, offeringInput.trim()];
      setOfferings(newOfferings);
      setValue('offerings', newOfferings);
      setOfferingInput('');
    }
  };

  const handleRemoveOffering = (index: number) => {
    const newOfferings = offerings.filter((_, i) => i !== index);
    setOfferings(newOfferings);
    setValue('offerings', newOfferings);
  };
  if (!initialData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Sidebar />
      <main className="max-w-7xl mx-auto px-4 pl-64 py-8">
        <motion.div
          className="border-b mb-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <nav className="-mb-px flex space-x-8">
            <a href="#" className="border-b-2 border-blue-500 pb-4 px-1 text-sm font-medium text-blue-600">
              Edit Profile
            </a>
            <a href="#" className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Bulk upload
            </a>
            <a href="#" className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Campaign tools
            </a>
          </nav>
        </motion.div>

        <div className="flex gap-12">
          <motion.div
            className="w-48"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <img
                src=""
                alt="Profile"
                className="w-32 h-32 rounded-full text-center"
              />
              <motion.div
                className="absolute bottom-0 right-8 bg-blue-600 rounded-full p-2"
                whileHover={{ scale: 1.1 }}
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 max-w-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
              {[
                { label: 'Business Name', name: 'business_name' },
                { label: 'Contact Person', name: 'contact_person' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone', type: 'tel' },
                { label: 'Address', name: 'address', full: true }
              ].map(({ label, name, type = 'text', full }) => (
                <motion.div
                  key={name}
                  className={full ? 'col-span-2' : ''}
                  whileHover={{ scale: 1.02 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <motion.input
                    type={type}
                    {...register(name as keyof BusinessFormData)}
                    className={`w-full p-2 border rounded-lg ${errors[name as keyof BusinessFormData] ? 'border-red-500' : ''}`}
                    animate={errors[name as keyof BusinessFormData] ? { x: [-5, 5, -5, 0] } : {}}
                    transition={{ duration: 0.2 }}
                  />
                  {errors[name as keyof BusinessFormData] && <p className="text-red-600">{errors[name as keyof BusinessFormData]?.message}</p>}
                </motion.div>
              ))}

              {/* Offerings Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6 border w-96 max-w-2xl"
              >
                {/* Section Title */}
                <motion.div
                  className="flex items-center mb-4"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Package className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Product Offerings</h2>
                </motion.div>

                {/* Input Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Offering</label>
                  <div className="flex items-center gap-3">
                    <motion.input
                      value={offeringInput}
                      onChange={(e) => setOfferingInput(e.target.value)}
                      placeholder="Enter a product or service"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                      type="button"
                      onClick={handleAddOffering}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </div>

                {/* Current Offerings List */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Offerings:</p>
                  {offerings.length === 0 ? (
                    <p className="text-gray-500 text-sm">No offerings added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {offerings.map((offering, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-3 rounded-lg w-full"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-gray-800">{offering}</span>
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveOffering(index)}
                            className="text-red-500 hover:text-red-700"
                            whileHover={{ scale: 1.1 }}
                          >
                            Remove
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>



              {/* Submit Button */}
              <motion.div className="col-span-2 mt-8 flex justify-end">
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div >
      </main >
    </motion.div >
  );
}

export default VendorProfile;
