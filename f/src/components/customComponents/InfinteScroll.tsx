import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// Define a type for the vendor object
interface Vendor {
  businessPromotionalMaterialURl: string;
}

interface InfiniteScrollProps {
  vendors: Vendor[];
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ vendors }) => {
  const navigate = useNavigate();
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      // Get the total width of all items
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [vendors]);

  if (!vendors || vendors.length === 0) {
    return null;
  }

  // Duplicate the vendors array to ensure we have enough items for a seamless loop
  const duplicatedVendors = [...vendors, ...vendors, ...vendors];

  return (
    <div className="mt-12 overflow-hidden p-3 relative w-full">
      <motion.div
        ref={carousel}
        className="flex space-x-4"
        initial={{ x: 0 }}
        animate={{
          x: [-width, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 10,
            ease: "linear",
          },
        }}
      >
        {duplicatedVendors
          .filter((vendor : any) => vendor.status === "approved") // Filter only approved vendors
          .map((vendor, index) => (
            <motion.img
              key={`vendor-${index}`}
              src={vendor.businessPromotionalMaterialURl}
              alt={`Promo ${index}`}
              className="w-64 h-40 object-cover rounded-lg shadow-md cursor-pointer shrink-0"
              onClick={() => navigate('/allPartners')}
            />
          ))}

      </motion.div>
    </div>
  );
};

export default InfiniteScroll;