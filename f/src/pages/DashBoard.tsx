import { useState } from "react";
import Navbar from "../components/customComponents/DashBoardNavbar";
import { Sidebar } from "../components/customComponents/Sidebar";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with Animation */}
      <motion.div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <Sidebar />
      </motion.div>

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "pl-64" : "pl-0"}`}>
        <Navbar />

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-md px-5 py-6 sm:px-6">
              <motion.h1
                className="text-2xl font-semibold text-gray-900 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Welcome to your Dashboard
              </motion.h1>
              <p className="text-gray-600">
                Manage your profile and business information here.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
