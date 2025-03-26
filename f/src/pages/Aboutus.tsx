import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AboutUs = () => {
    const navigate = useNavigate(); // React Router navigation hook

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6 py-10"
        >
            {/* Logo */}
            <motion.img
                src="/centerWheel.webp"
                alt="The MENU Logo"
                className="w-32 h-32 mb-6 bg-black p-4 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* About Us Content */}
            <motion.div 
                className="max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <h1 className="text-4xl font-bold text-[#DBC166] mb-6">About Us</h1>

                <p className="text-lg text-gray-800 leading-relaxed">
                    <span className="font-semibold text-[#DBC166]">Welcome to The MENU</span> —
                    South Africa’s first-of-its-kind interactive marketplace and engagement-driven rewards platform,
                    crafted to revolutionize how you connect, shop, and save.
                </p>

                <p className="text-lg text-gray-800 leading-relaxed mt-4">
                    At <span className="font-semibold text-[#DBC166]">The MENU</span>, our vision is clear:
                    we aim to empower our users, vendors, and affiliates by creating an exceptional ecosystem that
                    thrives on exclusivity, engagement, and memorable experiences. Leveraging innovative technology
                    and gamification, we're redefining the way loyalty is rewarded. Whether you're seeking exclusive
                    deals from leading brands, unique access to events, or extraordinary rewards simply for
                    participating—<span className="font-semibold text-[#DBC166]">The MENU</span> delivers it all.
                </p>

                <p className="text-lg text-gray-800 leading-relaxed mt-4">
                    <span className="font-semibold text-[#DBC166]">For our Vendors</span>, The MENU offers an
                    unprecedented platform to directly engage loyal customers without paying commissions, supported
                    by cutting-edge marketing and analytics tools to drive rapid, sustainable growth.
                </p>

                <p className="text-lg text-gray-800 leading-relaxed mt-4">
                    <span className="font-semibold text-[#DBC166]">To our Affiliates</span>, we extend lucrative,
                    performance-based partnerships designed for mutual success and innovation, turning engagement and
                    referrals into significant financial rewards.
                </p>

                <p className="text-lg text-gray-800 leading-relaxed mt-4">
                    Beyond business success, our mission is deeply rooted in creating meaningful social impact—uplifting
                    communities, nurturing local businesses, and contributing to economic empowerment.
                </p>

                <p className="text-lg text-gray-800 leading-relaxed mt-6 font-semibold">
                    We invite you to join <span className="text-[#DBC166]">The MENU</span> — Your World, Your Way.
                    Together, let's shape the future of interactive shopping and community engagement.
                </p>

                {/* Back Button */}
                <motion.button
                    onClick={() => navigate(-1)}
                    className="mt-8 px-6 py-2 bg-[#DBC166] text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    ← Go Back
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default AboutUs;
