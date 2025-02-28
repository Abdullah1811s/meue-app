import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Award, CreditCard, Trophy, Users } from "lucide-react";

const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.6, -0.05, 0.01, 0.99]
        }
    }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.15,
            ease: "easeOut"
        }
    }
};

const slideIn = {
    hidden: {
        x: -60,
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99]
        }
    }
};

const scaleUp = {
    hidden: {
        scale: 0.8,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.6, -0.05, 0.01, 0.99]
        }
    }
};

const images = [
   "/s1.jpg",
   "/s2.jpg",
   "/s3.jpg"
];

const features = [
    {
        icon: <CreditCard className="w-6 h-6 text-[#DBC166]" />,
        title: "Exclusive vendor deals",
        description: "Access premium discounts from top South African brands"
    },
    {
        icon: <Trophy className="w-6 h-6 text-[#DBC166]" />,
        title: "Gamified rewards",
        description: "Earn points and unlock rewards through interactive challenges"
    },
    {
        icon: <Award className="w-6 h-6 text-[#DBC166]" />,
        title: "Cash prize giveaways",
        description: "Regular opportunities to win cash and exciting prizes"
    },
    {
        icon: <Users className="w-6 h-6 text-[#DBC166]" />,
        title: "Leaderboards & rankings",
        description: "Compete with others and climb the rewards ladder"
    }
];

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <motion.section initial="hidden" animate="visible" className="py-10 md:py-16">
            <div className="container mx-auto px-4">
                {/* Header with gray background */}
                <motion.div
                    variants={fadeInUp}
                    className="bg-gray-200 rounded-xl p-6 mb-8 text-center"
                >
                    <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">
                        90% OFF Beta Access! <span className="text-[#DBC166]">Get R500+ Worth</span>
                        <br /> of Savings for Just R50!
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                        Join South Africa's first interactive rewards platform – where you win, vendors win, and everyone benefits.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left side features */}
                    <motion.div variants={staggerChildren} className="space-y-20">
                        {features.slice(0, 2).map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={scaleUp}
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
                            >
                                <div className="flex items-start gap-8">
                                    <div className="mt-1">{feature.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Center image slider - smaller size */}
                    <motion.div variants={fadeInUp} className="relative w-full max-w-md mx-auto">
                        <motion.div className="rounded-2xl shadow-xl overflow-hidden aspect-[4/3] w-64 h-48 mx-auto">
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt="Slider Image"
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        </motion.div>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/70 p-2 rounded-full hover:bg-black transition-colors"
                        >
                            <FaChevronLeft size={16} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/70 p-2 rounded-full hover:bg-black transition-colors"
                        >
                            <FaChevronRight size={16} />
                        </button>

                        {/* Slider indicators */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full ${currentIndex === index ? "bg-white" : "bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Right side features */}
                    <motion.div variants={staggerChildren} className="space-y-20">
                        {features.slice(2, 4).map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={scaleUp}
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">{feature.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* CTA Button */}
                <motion.div
                    variants={fadeInUp}
                    className="mt-10 text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#DBC166] hover:bg-[#c9af5a] text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
                    >
                        💰 Get 90% Off – Join for Just R50!
                    </motion.button>
                </motion.div>
            </div>
        </motion.section>
    );
}