import { Settings, Bell, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        {/* Title */}
        <motion.h1
          className="text-xl font-semibold text-gray-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Setting
        </motion.h1>

        {/* Search & Icons */}
        <div className="flex items-center gap-4">
          {/* Search Input (Collapsible on Mobile) */}
          <div className={`relative ${isSearchOpen ? "block" : "hidden md:block"}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <motion.input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "16rem", opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Toggle Search Button on Mobile */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-6 w-6 text-gray-600" />
          </button>

          {/* Icons with Animation */}
          {[Settings, Bell].map((Icon, index) => (
            <motion.button
              key={index}
              className="p-2 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon className="h-6 w-6 text-gray-600" />
            </motion.button>
          ))}

          {/* Profile Image */}
          <motion.img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
            alt="Profile"
            className="w-10 h-10 rounded-full"
            whileHover={{ scale: 1.1 }}
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
