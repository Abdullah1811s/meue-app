import { Home, Settings, CreditCard, Menu, X } from 'lucide-react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Sidebar() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("VendorToken");
        navigate('/');
    }
    const menuItems = [
        { icon: Home, label: 'Dashboard', path: `/vendor/dashboard/${id}` },
        { icon: CreditCard, label: 'Automated Pay', path: '/automated-pay' },
        { icon: Settings, label: 'Settings', path: `/vendor/profile/setting/${id}` }
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-[#6f6aff] p-2 rounded-md text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-50 
                            ${isOpen ? "block" : "hidden"} md:block`}
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                exit={{ x: -200 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Business Portal</h2>
                        <button className="md:hidden" onClick={() => setIsOpen(false)}>
                            <X className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>

                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <motion.li
                                        key={item.path}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            to={item.path}
                                            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-[#6f6aff] text-white' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Home Button */}
                    <div className="p-4 mt-auto">
                        <button
                            className="w-full flex items-center justify-center px-4 py-3 bg-[#6f6aff] text-white rounded-lg hover:bg-[#5b5ae6] transition-transform duration-200 hover:scale-105"
                            onClick={() => navigate(`/vendor/${id}`)}
                        >
                            <Home className="w-5 h-5 mr-3" />
                            <span>Home</span>
                        </button>
                    </div>

                    <div className="p-4 mt-auto">
                        <button
                            className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-transform duration-200 hover:scale-105"
                            onClick={handleLogout}
                        >
                            <Home className="w-5 h-5 mr-3" />
                            <span>Logout</span>
                        </button>
                    </div>



                </div>
            </motion.div>
        </>
    );
}
