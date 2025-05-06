
import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"

import VendorDetails from "@/components/customComponents/VendorDetails"

// Animation variants
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15,
      ease: "easeOut",
    },
  },
}

const scaleUp = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const AllPartners = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [vendors, setVendors] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const itemsPerPage = 3
  const base_url = import.meta.env.VITE_API_BASE_URL

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${base_url}/vendor`)

      // Filter vendors to only include those with status "approved"
      const approvedVendors = response.data.filter((vendor: any) => vendor.status === "approved")
      setVendors(approvedVendors)
      setError(null)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load partners. Please try again later.")
      setVendors([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate pagination values based on filtered vendors
  const indexOfLastVendor = currentPage * itemsPerPage
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor)
  const totalPages = Math.ceil(vendors.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    setSelectedVendorId(null)
  }

  const selectVendor = (vendorId: string) => {
    setSelectedVendorId(selectedVendorId === vendorId ? null : vendorId)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const selectedVendor = vendors.find((vendor) => vendor._id === selectedVendorId)

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1,
          ease: "linear",
        }}
      >
        <Loader2 className="h-12 w-12 text-[#DBC166] animate-spin" />
      </motion.div>
    </div>
  )

  // Error Message Component
  const ErrorMessage = () => (
    <div className="text-center text-red-500 p-8">
      <p className="text-xl mb-4">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={fetchData}
        className="bg-[#DBC166] text-white px-4 py-2 rounded-full hover:bg-[#C0A95A] transition-colors"
      >
        Try Again
      </motion.button>
    </div>
  )

  // No Approved Vendors Component
  const NoApprovedVendors = () => (
    <div className="text-center p-8">
      <p className="text-xl mb-4 text-gray-600">No approved partners available at the moment.</p>
      <p className="text-gray-500">Please check back later for updates.</p>
    </div>
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      className="flex flex-col min-h-screen bg-white text-gray-800"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Section Title */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our network of premium partners offering exclusive deals, discounts, and rewards — only on The
              Menu.
            </p>
          </motion.div>

          {/* Conditional Rendering Based on Loading/Error State */}
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage />
          ) : vendors.length === 0 ? (
            <NoApprovedVendors />
          ) : (
            <>
              {/* Vendor Cards Section */}
              <motion.div variants={scaleUp} className="w-full overflow-x-auto pb-6">
                <div className="flex flex-col items-center md:flex-row justify-center p-6 flex-wrap gap-6 min-w-max px-4">
                  {currentVendors.map((vendor: any) => (
                    <motion.div
                      key={vendor._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className={`flex-shrink-0 w-[280px] cursor-pointer transition-all duration-300 ${
                        selectedVendorId === vendor._id ? "scale-105 ring-2 ring-[#DBC166]" : "hover:scale-105"
                      }`}
                      onClick={() => selectVendor(vendor._id)}
                    >
                      {/* Vendor Card Content */}
                      <div className="bg-white shadow-xl rounded-xl p-6 h-full flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="h-24 w-24 rounded-full overflow-hidden border-4 border-[#DBC166] mb-4"
                        >
                          <img
                            src={
                              vendor?.businessPromotionalMaterialURl?.secure_url ||
                              "/placeholder.svg?height=150&width=150"
                            }
                            alt={`${vendor?.businessName || "Business"} logo`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.onerror = null
                              target.src = "/placeholder.svg?height=150&width=150"
                            }}
                          />
                        </motion.div>
                        <div className="text-center">
                          <h2 className="text-xl font-bold text-gray-800 mb-2">{vendor.businessName}</h2>
                          <p className="text-gray-600 text-sm capitalize mb-4">{vendor.businessType}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center bg-[#DBC166] hover:bg-[#C0A95A] text-white py-2 px-4 rounded-full shadow-md transition-all duration-200 text-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              selectVendor(vendor._id)
                            }}
                          >
                            {selectedVendorId === vendor._id ? (
                              <>
                                <span className="mr-1">Hide Details</span>
                                <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <span className="mr-1">View Details</span>
                                <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Selected Vendor Details */}
              <AnimatePresence>{selectedVendor && <VendorDetails vendor={selectedVendor} />}</AnimatePresence>

              {/* Pagination */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center space-y-6 mt-12">
                <div className="text-gray-500 font-medium">
                  {vendors.length > 0 ? (
                    <>
                      🌟 Pages <span className="text-blue-600">{currentPage}</span> of{" "}
                      <span className="text-blue-600">{totalPages}</span>
                    </>
                  ) : (
                    "🚀 No partners found – Stay tuned!"
                  )}
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#DBC166] text-white hover:bg-[#C0A95A]"
                    } transition-colors duration-200`}
                  >
                    &lt;
                  </motion.button>

                  <div className="flex items-center justify-center space-x-3">
                    {[...Array(totalPages)].map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentPage === index + 1
                            ? "bg-[#DBC166] transform scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#DBC166] text-white hover:bg-[#C0A95A]"
                    } transition-colors duration-200`}
                  >
                    &gt;
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AllPartners
