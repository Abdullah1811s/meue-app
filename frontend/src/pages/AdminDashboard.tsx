import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { Users, Menu, X, CheckCircle, Tv, XCircle, Mail, Calendar, Phone, MapPin, LogOut, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Affiliated {
  _id: string;
  fullname: string;
  email: string;
  status: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  marketingChannel?: string;
  offering: string;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AdminDashboard = () => {
  const [affiliates, setAffiliates] = useState<Affiliated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('affiliates');
  const [loadingAffiliateId, setLoadingAffiliateId] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/affiliated/affiliated`);

      setAffiliates(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch affiliates');
      console.error('Error fetching affiliates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (affiliate: Affiliated, newStatus: string) => {
    try {
      setLoadingAffiliateId(affiliate._id); // Start loading
      const token = localStorage.getItem("AdminToken");

      if (!token) {
        throw new Error("No admin token found. Please log in.");
      }

      await axios.put(
        `${API_BASE_URL}/admin/updateStatus`,
        { id: affiliate._id, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (newStatus === "rejected") {
        await axios.delete(
          `${API_BASE_URL}/admin/removeAffiliate?id=${affiliate._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setAffiliates((prev) => prev.filter((a) => a._id !== affiliate._id));
      } else {
        setAffiliates((prev) =>
          prev.map((a) =>
            a._id === affiliate._id ? { ...a, status: newStatus } : a
          )
        );
      }

      toast.success(`Status updated to ${newStatus}!`);
    } catch (error: any) {
      console.error("Error updating status:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setLoadingAffiliateId(null);
    }
  };


  function handleLogout(): void {
    localStorage.removeItem("AdminToken");
    navigate('/');
  }

  return (

    <div className="flex h-screen bg-gray-100">

      <aside className={`fixed lg:relative bg-gray-800 text-white w-64 lg:w-72 h-full p-6 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-700 rounded-lg">
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveSection('affiliates')} className={`flex items-center space-x-3 w-full p-4 rounded-lg transition-colors ${activeSection === 'affiliates' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Users size={20} />
            <span>Manage Affiliates</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
        <div className="flex items-center ml-auto">

        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
            <Menu size={24} />
          </button>
        </nav>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {affiliates.map((affiliate) => (
                <motion.div
                  key={affiliate._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{affiliate.fullname}</h3>
                      <p className="text-gray-500"> Affiliate Member</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${affiliate.status === 'approved' ? 'bg-green-100 text-green-800' : affiliate.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {affiliate.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail size={18} />
                      <span>{affiliate.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Phone size={18} />
                      <span>{affiliate.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin size={18} />
                      <span>{affiliate.address || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar size={18} />
                      <span>{affiliate.createdAt || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Tv size={18} />
                      <span>{affiliate.marketingChannel || 'N/A'}</span>
                    </div>
                    <div className="flex items-start space-x-3 text-gray-700 bg-gray-100 p-3 rounded-md border border-gray-300 w-full break-words">
                      <PackageCheck size={20} className="text-[#C5AD59] mt-1 flex-shrink-0" />
                      <textarea className="text-sm font-medium leading-relaxed break-words w-full"
                        readOnly>
                        {affiliate.offering || "No offering details provided"}

                      </textarea>
                    </div>


                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
                    <button
                      onClick={() => handleStatusUpdate(affiliate, "approved")}
                      className="text-green-600 hover:text-green-800 flex items-center"
                      disabled={affiliate.status === "approved" || loadingAffiliateId === affiliate._id}
                    >
                      {loadingAffiliateId === affiliate._id ? (
                        <span className="animate-spin border-2 border-green-600 border-t-transparent rounded-full w-4 h-4"></span>
                      ) : (
                        <CheckCircle size={20} />
                      )}
                      <span className="ml-2">Approve</span>
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(affiliate, "rejected")}
                      className="text-red-600 hover:text-red-800 flex items-center"
                      disabled={affiliate.status === "rejected" || loadingAffiliateId === affiliate._id}
                    >
                      {loadingAffiliateId === affiliate._id ? (
                        <span className="animate-spin border-2 border-red-600 border-t-transparent rounded-full w-4 h-4"></span>
                      ) : (
                        <XCircle size={20} />
                      )}
                      <span className="ml-2">Reject</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
