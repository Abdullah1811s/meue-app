"use client"

import { motion } from "framer-motion"
import { Globe, Phone, Mail, MapPin, Briefcase, User, Facebook, Instagram, Twitter, Tag } from "lucide-react"
import { useSelector } from "react-redux"

const VendorDetails = ({ vendor }: { vendor: any }) => {
  const isUserAuthenticated = useSelector((state: any) => state.auth.isUserAuthenticated)

  // Format date function for wheel offers
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-12 border border-gray-200"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Profile Section */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-gray-300 mb-4 sm:mb-6">
            <img
              src={vendor?.businessPromotionalMaterialURl?.secure_url || "/placeholder.svg?height=150&width=150"}
              alt={`${vendor?.businessName || "Business"} logo`}
              className="h-full w-full object-cover flex"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = "/placeholder.svg?height=150&width=150"
              }}
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              {vendor.businessName}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg capitalize mb-4">
              {vendor.businessType.replace(/_/g, " ")}
            </p>

          </div>
        </div>

        {/* Details Section */}
        <div className="md:w-2/3">
          <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 text-lg sm:text-xl">About</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">{vendor.businessDescription}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-[#DBC166] mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">Contact</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">{vendor.businessContactNumber}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-[#DBC166] mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">{vendor.businessEmail}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-[#DBC166] mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">
                  {vendor.tradingAddress}, {vendor.city}, {vendor.province}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Briefcase className="h-5 w-5 text-[#DBC166] mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">Business Type</p>
                <p className="text-sm sm:text-base text-gray-600 capitalize break-words">{vendor.businessType}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 text-lg sm:text-xl">Representative</h3>
            <div className="flex items-start space-x-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
              <User className="h-5 w-5 text-[#DBC166] mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base text-gray-800 font-medium">{vendor.representativeName}</p>
                <p className="text-sm sm:text-base text-gray-600">{vendor.representativePosition}</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">{vendor.representativeEmail}</p>
              </div>
            </div>
          </div>

          {vendor.exclusiveOffer && (
            <div className="mb-6 sm:mb-8">
              <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 text-lg sm:text-xl">Exclusive Offer</h3>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-300">
                <p className="text-base sm:text-lg font-medium text-gray-700 mb-2 capitalize">
                  {vendor.exclusiveOffer.type} Offer
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{vendor.exclusiveOffer.details}</p>
                <p className="text-xs sm:text-sm text-gray-500 italic">Terms: {vendor.exclusiveOffer.terms}</p>
              </div>
            </div>
          )}

          {/* Wheel Offer Section - Only visible to authenticated users */}
          {isUserAuthenticated && vendor.wheelOffer && vendor.wheelOffer.type && (
            <div className="mb-6 sm:mb-8">
              <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 text-lg sm:text-xl">
                <span className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-[#DBC166]" />
                  Exclusive Member Offer
                </span>
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-300"
              >
                <p className="text-base sm:text-lg font-medium text-gray-700 mb-2 capitalize">
                  {vendor.wheelOffer.type} Offer
                </p>

                {vendor.wheelOffer.offerings && vendor.wheelOffer.offerings.length > 0 && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm font-medium text-gray-700">Available Rewards:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vendor.wheelOffer.offerings.map((offering: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded-md shadow-sm border border-gray-300">
                          <p className="font-medium text-gray-800">{offering.name}</p>
                          <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>Quantity: {offering.quantity || "N/A"}</span>
                            <span>Ends: {formatDate(offering.endDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {vendor.wheelOffer.terms && (
                  <p className="text-xs sm:text-sm text-gray-700 italic mt-4">Terms: {vendor.wheelOffer.terms}</p>
                )}
              </motion.div>
            </div>
          )}

          <div>
            <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 text-lg sm:text-xl">Connect</h3>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {vendor.socialMediaHandles?.facebook && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  href={vendor.socialMediaHandles.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.a>
              )}
              {vendor.socialMediaHandles?.instagram && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  href={vendor.socialMediaHandles.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.a>
              )}
              {vendor.socialMediaHandles?.twitter && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  href={vendor.socialMediaHandles.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.a>
              )}
              {vendor.websiteUrl && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  href={vendor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Website"
                >
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VendorDetails
