import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";

// Define a type for the vendor object
interface Vendor {
  businessName: any;
  businessPromotionalMaterialURl?: {
    secure_url: string;
  };
  status?: string;
}

interface InfiniteScrollProps {
  vendors: Vendor[];
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ vendors }) => {
  const navigate = useNavigate();
  const carousel = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [vendors]);

  if (!vendors || vendors.length === 0) {
    return null;
  }

  // Filter only approved vendors
  const approvedVendors = vendors.filter((vendor) => vendor.status === "approved");

  // Duplicate vendors array to create a seamless infinite scroll effect
  const duplicatedVendors = useMemo(() => [...approvedVendors, ...approvedVendors, ...approvedVendors], [approvedVendors]);

  return (
    <div className="relative w-full overflow-hidden p-3 mt-12">
      <motion.div
        ref={carousel}
        className="flex space-x-6"
        initial={{ x: 0 }}
        animate={{ x: [-width, 0] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
        }}
      >
        {duplicatedVendors.map((vendor, index) => (
          <motion.img
            key={`vendor-${index}`}
            src={vendor.businessPromotionalMaterialURl?.secure_url || ""}
            alt={`${vendor.businessName || "a vendor"}`}
            width={40}
            height={30}
            className="w-64 h-40 object-contain rounded-lg shadow-lg cursor-pointer shrink-0 hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/allPartners")}
            aria-label={`View details of ${vendor.businessName || "this vendor"}`}
          />

        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteScroll;
