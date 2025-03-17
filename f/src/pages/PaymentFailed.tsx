import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AlertOctagon } from "lucide-react";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white/10 backdrop-blur-lg shadow-lg rounded-xl p-8 max-w-sm border border-white/20"
      >
        {/* Animated Alert Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 8 }}
          className="flex justify-center mb-4"
        >
          <AlertOctagon className="w-16 h-16 text-red-500" />
        </motion.div>

        {/* Heading & Text */}
        <h1 className="text-3xl font-bold text-black mb-3">Payment Failed</h1>
        <p className="text-gray-700 mb-6">Something went wrong. Please try again.</p>

        {/* Navigate back to users/:id */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/users/${id}`)} // Navigate to users/:id
          className="px-6 py-3 rounded-lg font-semibold text-black transition-all duration-300 shadow-md"
          style={{ backgroundColor: "#DBC166" }}
        >
          Go Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
