import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopupBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Show popup after a short delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        // Check if user has already closed the popup
        const hasClosedPopup = localStorage.getItem('popupClosed');
        if (hasClosedPopup) {
            setIsVisible(false);
        }

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('popupClosed', 'true');
    };

    const handleSignupClick = () => {
        navigate('/signup');
        handleClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Popup Container - Made smaller */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3"
                    >
                        <div className="relative w-full max-w-2xl h-fit overflow-hidden rounded-xl shadow-xl bg-gradient-to-br from-gray-900 to-black">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1 sm:p-1.5 shadow-md transition-all duration-200 hover:scale-110"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {/* Scrollable Content Container */}
                            <div className="h-full overflow-y-auto">
                                {/* Responsive Layout Container */}
                                <div className="flex flex-col md:flex-row h-auto">
                                    {/* Image Section - Complete on mobile, scrollable */}
                                    <div className="md:w-1/2 flex-shrink-0 bg-black">
                                        <div className="relative w-full h-56 md:h-full min-h-[200px] overflow-hidden">
                                            <img
                                                src="/banner.webp"
                                                alt="Win Exciting Prizes"
                                                className="w-full h-full object-contain md:object-cover"
                                                loading="eager"
                                            />
                                        </div>
                                    </div>

                                    {/* CTA Section - Always scrollable on mobile */}
                                    <div className="md:w-1/2 flex flex-col p-3 sm:p-4 md:p-5 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#2d2d2d]">
                                        <div className="flex flex-col justify-center items-center text-center min-h-full py-3">
                                            {/* Main heading */}
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 leading-tight px-2">
                                                Your Chance to Win!
                                            </h2>

                                            {/* Subheading */}
                                            <h3 className="text-sm sm:text-base md:text-lg text-[#DBC166] font-semibold mb-2 px-2">
                                                Exclusive Giveaways & Prizes Await!
                                            </h3>

                                            {/* Body text */}
                                            <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-4 max-w-md leading-relaxed px-2">
                                                Sign up now for a chance to win amazing prizes, exclusive discounts, and early access to the hottest deals!
                                            </p>

                                            {/* CTA Button Container */}
                                            <div className="w-full max-w-xs mb-4 px-2">
                                                <motion.button
                                                    animate={{
                                                        rotate: [0, 1, -1, 0],
                                                        boxShadow: [
                                                            '0 0 0 0 rgba(219, 193, 102, 0.4)',
                                                            '0 0 0 6px rgba(219, 193, 102, 0)',
                                                            '0 0 0 0 rgba(219, 193, 102, 0.4)',
                                                        ],
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 2,
                                                        ease: "easeInOut",
                                                        repeatType: "loop"
                                                    }}
                                                    whileHover={{
                                                        scale: 1.05,
                                                        boxShadow: '0 3px 15px rgba(219, 193, 102, 0.5)',
                                                        backgroundColor: '#E5C478'
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleSignupClick}
                                                    className="w-full bg-gradient-to-r from-[#DBC166] via-[#E5C478] to-[#EFD18A] text-black font-bold py-2 px-4 rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform"
                                                >
                                                    🎯 SIGN UP & WIN BIG!
                                                </motion.button>
                                            </div>

                                            {/* Prize Highlight */}
                                            <div className="mt-3 p-2 border border-[#DBC166]/30 rounded-lg bg-gradient-to-r from-[#DBC166]/10 to-transparent w-full max-w-md mx-2">
                                                <p className="text-white text-xs italic">
                                                    "Don't miss this opportunity! Early sign-ups get extra entries into our exclusive promotions."
                                                </p>
                                            </div>

                                            {/* Additional scrollable content for better UX */}
                                         
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PopupBanner;