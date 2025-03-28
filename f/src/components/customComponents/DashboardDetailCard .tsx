import { motion } from "framer-motion";

const DashboardDetailCard = ({ title, value }: { title: string, value: any }) => {
    return (
        <motion.div
            className="bg-white p-4 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-lg font-semibold">{title}</h2>
          
            <p>{value || "Nothing to show"}</p>
        </motion.div>
    );
};

export default DashboardDetailCard;
