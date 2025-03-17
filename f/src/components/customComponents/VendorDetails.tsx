import { motion } from "framer-motion";
import { Globe, Phone, Mail, MapPin, Briefcase, User, Facebook, Instagram, Twitter } from 'lucide-react';
const VendorDetails = ({ vendor }: { vendor: any }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-12 border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-[#DBC166] mb-6">
              <img
                src={vendor.businessPromotionalMaterialURl.secure_url}
                alt={`${vendor.businessName}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{vendor.businessName}</h2>
              <p className="text-gray-600 text-lg capitalize mb-4">{vendor.businessType}</p>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h3 className="font-medium text-gray-700 mb-3 text-xl">About</h3>
            <p className="text-gray-600 mb-8">{vendor.businessDescription}</p>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-[#DBC166] mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact</p>
                  <p className="text-gray-600">{vendor.businessContactNumber}</p>
                </div>
              </div>
  
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-[#DBC166] mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-600">{vendor.businessEmail}</p>
                </div>
              </div>
  
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#DBC166] mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">{vendor.tradingAddress}, {vendor.city}, {vendor.province}</p>
                </div>
              </div>
  
              <div className="flex items-start space-x-3">
                <Briefcase className="h-5 w-5 text-[#DBC166] mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Business Type</p>
                  <p className="text-gray-600 capitalize">{vendor.businessType}</p>
                </div>
              </div>
            </div>
  
            <div className="mb-8">
              <h3 className="font-medium text-gray-700 mb-3 text-xl">Representative</h3>
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <User className="h-5 w-5 text-[#DBC166] mt-1" />
                <div>
                  <p className="text-gray-800 font-medium">{vendor.representativeName}</p>
                  <p className="text-gray-600">{vendor.representativePosition}</p>
                  <p className="text-gray-600">{vendor.representativeEmail}</p>
                </div>
              </div>
            </div>
  
            {vendor.exclusiveOffer && (
              <div className="mb-8">
                <h3 className="font-medium text-gray-700 mb-3 text-xl">Exclusive Offer</h3>
                <div className="bg-[#DBC166] bg-opacity-10 p-6 rounded-lg border border-[#DBC166]">
                  <p className="text-lg font-medium text-[#DBC166] mb-2 capitalize">{vendor.exclusiveOffer.type} Offer</p>
                  <p className="text-gray-700 mb-4">{vendor.exclusiveOffer.details}</p>
                  <p className="text-sm text-gray-500 italic">Terms: {vendor.exclusiveOffer.terms}</p>
                </div>
              </div>
            )}
  
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-xl">Connect</h3>
              <div className="flex space-x-6">
                {vendor.socialMediaHandles?.facebook && (
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    href={vendor.socialMediaHandles.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </motion.a>
                )}
                {vendor.socialMediaHandles?.instagram && (
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    href={vendor.socialMediaHandles.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </motion.a>
                )}
                {vendor.socialMediaHandles?.twitter && (
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    href={vendor.socialMediaHandles.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                  </motion.a>
                )}
                {vendor.websiteUrl && (
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    href={vendor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Globe className="h-6 w-6" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  export default VendorDetails;