/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react';

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import { Gift, ShoppingBag, ArrowUp, Users, Lock } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import { StatCard } from "../components/customComponents/StatCard";
import Lapboard from "../components/customComponents/Lapboard";
import RankCard from "../components/customComponents/RankCard";
import WeeklyRaffles from "../components/customComponents/WeeklyRaffles";
import CampaignPerformance from "../components/customComponents/CampaignPerformance";
import SpinWheel from "../components/customComponents/SpinWheel";
import InfiniteScroll from '@/components/customComponents/InfinteScroll';
import { Button } from '@/components/ui/button';
import AnalogTimer from '@/components/customComponents/AnalogTimer';
import AppTimer from '@/components/customComponents/apptimer';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PopupBanner from './PopupBanner';
// import { useSelector } from 'react-redux';

// Enhanced animation variants
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

// const slideIn = {
//   hidden: {
//     x: -60,
//     opacity: 0
//   },
//   visible: {
//     x: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.8,
//       ease: [0.6, -0.05, 0.01, 0.99]
//     }
//   }
// };

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
 
  "/s2.avif",
  "/s3.avif",
  "/s111.avif",
];

export default function Home() {
  const isAuthenticated = useSelector((state: any) => state.auth.isUserAuthenticated);
  const isVendorAuthenticated = useSelector((state: any) => state.auth.isVendorAuthenticated);
  let userId: string;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [portraitMap, setPortraitMap] = useState<Record<number, boolean>>({});

  const [hasFetched, setHasFetched] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<any>();
  const [vendors, setVendors] = useState<any[]>([]);
  const [currentSlide,] = useState(0);
  const [user, setUser] = useState<any>(null);
  const isAuth = useSelector((state: any) => state.auth.isUserAuthenticated)
  const isPaid = useSelector((state: any) => state.auth.isPaid)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<"R10" | "R50" | null>(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    // Handle mobile timer
    if (isMobile) {
      const timer = setTimeout(() => setShowTimer(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);



  useEffect(() => {
    const id = localStorage.getItem("id")
    if (isAuthenticated && id) {

      userId = id;
      navigate(`/users/${id}`);
    } else if (isVendorAuthenticated && id) {

      navigate(`/vendor/${id}`);
    }
  }, [isAuthenticated, isVendorAuthenticated, navigate]);

  useEffect(() => {

    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasFetched) {
      console.log("fetching");
      fetchData();
    }
    else
      console.log("already fetched");
  }, [hasFetched]);



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Ensure `user` exists before checking `isPaid`
    if (user && isPaid && user.userType === "R10") {
      console.log("User has paid again, restarting timer...");
      localStorage.removeItem("hasRefreshed");
      startTimer(new Date().toISOString()); // Assume payment just happened now
    }
  }, [isPaid]);

  const fetchData = async () => {
    try {
      // Create an array to store promises
      const requests = [axios.get(`${API_BASE_URL}/vendor`)];

      // If userId exists, add the user fetch request
      if (userId) {
        requests.push(axios.get(`${API_BASE_URL}/users/${userId}`));
      }

      // Execute all requests concurrently
      const responses = await Promise.all(requests);

      // Vendor data will always be in the first response
      setVendors(responses[0].data);

      // If userId exists, handle the user response (it's the second response)
      if (userId) {
        const fetchedUser = responses[1].data.user;
        setUser(fetchedUser);

        // Start timer only if `userType` is "R10"
        if (fetchedUser.userType === "R10") {
          startTimer(fetchedUser.R10UserPaidDate);
        }
      }

      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };



  const startTimer = (paidDate: any) => {
    const paidTime = new Date(paidDate).getTime();
    const expireTime = paidTime + 60 * 60 * 1000;

    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const remainingTime = expireTime - currentTime;

      if (remainingTime <= 0) {
        // Show message that the session has ended
        setTimeLeft("Your payment session has ended. Please make a payment to continue.");

        // Check if the page has already been refreshed
        const hasRefreshed = localStorage.getItem("hasRefreshed");

        if (!hasRefreshed) {
          // Set the flag in localStorage to indicate the page has been refreshed
          localStorage.setItem("hasRefreshed", "true");

          // Refresh the page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Wait for 2 seconds before refreshing
        }
        return;
      }

      const minutesLeft = Math.floor((remainingTime / (1000 * 60)) % 60);
      const secondsLeft = Math.floor((remainingTime / 1000) % 60);

      setTimeLeft(
        minutesLeft > 30
          ? `${minutesLeft} min ${secondsLeft} sec left before another payment.`
          : `Pay again in ${minutesLeft} min ${secondsLeft} sec.`
      );
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  };

  //yoco R50
  const handleClick = async () => {
    if (isDisabled) return;

    setIsDisabled(true);

    // Check if user is authenticated
    if (!isAuth) {
      // Navigate to signup if user is not authenticated
      setTimeout(() => {
        navigate('/signup');
        setIsDisabled(false);
      }, 1000);
    } else {
      try {
        // Get the UserToken and id from localStorage
        const UserToken = localStorage.getItem('UserToken');
        const userId = localStorage.getItem('id'); // Assuming 'id' is stored in localStorage

        if (!userId) {
          // Handle case where 'id' is not available
          console.error("User ID is missing in localStorage");
          setIsDisabled(false);
          return;
        }
        toast.success("sending")
        const response = await axios.post(
          `${API_BASE_URL}/payment/checkout`,
          {
            amount: 5000,
            currency: "ZAR",
            id: userId,  // Pass the retrieved id here
          },
          {
            headers: {
              Authorization: `Bearer ${UserToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        window.location.href = response.data.redirectUrl;
      } catch (error) {
        console.error("Payment error:", error);
      } finally {
        setIsDisabled(false);
      }
    }
  };

  //yoco R10
  const handleClickR10 = async () => {
    if (isDisabled) return;

    setIsDisabled(true);

    // Check if user is authenticated
    if (!isAuth) {
      // Navigate to signup if user is not authenticated
      setTimeout(() => {
        navigate('/signup');
        setIsDisabled(false);
      }, 1000);
    } else {
      try {
        // Get the UserToken and id from localStorage
        const UserToken = localStorage.getItem('UserToken');
        const userId = localStorage.getItem('id'); // Assuming 'id' is stored in localStorage

        if (!userId) {
          // Handle case where 'id' is not available
          console.error("User ID is missing in localStorage");
          setIsDisabled(false);
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/payment/checkout`,
          {
            amount: 1000,
            currency: "ZAR",
            id: userId,  // Pass the retrieved id here
          },
          {
            headers: {
              Authorization: `Bearer ${UserToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        window.location.href = response.data.redirectUrl;
      } catch (error) {
        console.error("Payment error:", error);
      } finally {
        setIsDisabled(false);
      }
    }
  };

  //peach R10
  const handlePeachPayR10 = async () => {
    if (isDisabled) return;

    setIsDisabled(true);

    // Check if user is authenticated
    if (!isAuth) {
      // Navigate to signup if user is not authenticated
      setTimeout(() => {
        navigate('/signup');
        setIsDisabled(false);
      }, 1000);
    } else {
      try {
        // Get the UserToken and id from localStorage
        const UserToken = localStorage.getItem('UserToken');
        const id = localStorage.getItem('id'); // Assuming 'id' is stored in localStorage

        if (!id) {
          // Handle case where 'id' is not available
          console.error("User ID is missing in localStorage");
          setIsDisabled(false);
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/payment/checkout/peach`,
          {
            amount: 10,
            id
          },
          {
            headers: {
              Authorization: `Bearer ${UserToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        window.location.href = response.data.redirectUrl;
      } catch (error) {
        console.error("Payment error:", error);
      } finally {
        setIsDisabled(false);
      }
    }
  }
  //peach R10
  const handlePeachPayR50 = async () => {
    if (isDisabled) return;

    setIsDisabled(true);

    // Check if user is authenticated
    if (!isAuth) {
      // Navigate to signup if user is not authenticated
      setTimeout(() => {
        navigate('/signup');
        setIsDisabled(false);
      }, 1000);
    } else {
      try {
        // Get the UserToken and id from localStorage
        const UserToken = localStorage.getItem('UserToken');
        const id = localStorage.getItem('id'); // Assuming 'id' is stored in localStorage

        if (!id) {
          // Handle case where 'id' is not available
          console.error("User ID is missing in localStorage");
          setIsDisabled(false);
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/payment/checkout/peach`,
          {
            amount: 50,
            id
          },
          {
            headers: {
              Authorization: `Bearer ${UserToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        window.location.href = response.data.redirectUrl;
      } catch (error) {
        console.error("Payment error:", error);
      } finally {
        setIsDisabled(false);
      }
    }
  }


  const handlePaymentR50 = async (method: "peach" | "yoco") => {
    if (method === "peach") {
      handlePeachPayR50();
    } else {
      handleClick();
    }
  }
  const handlePaymentR10 = async (method: "peach" | "yoco") => {
    if (method === "peach") {
      await handlePeachPayR10();
    } else {
      await handleClickR10();
    }
  }


  return (
    <>

      <Button
        onClick={scrollToTop}
        className={`fixed bottom-8 sm:bottom-6 lg:bottom-10 
    right-4 sm:right-6 lg:right-10 
    p-2 sm:p-3 lg:p-4 bg-[#DBC166] text-black font-bold 
    hover:bg-[#d4cbab] rounded-full shadow-md 
    transition-all duration-500 ease-in-out z-10
    ${showScroll ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" strokeWidth={4} />
      </Button>

      <motion.main
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-2 w-full max-w-7xl mx-auto"
      >
          <PopupBanner />
        {(!isMobile || showTimer) && (
          <>
            <AnalogTimer />
            <AppTimer />
          </>
        )}
        {timeLeft && !timeLeft.includes("expired") && (
          <div className="fixed text-black bottom-0 right-1 sm:bottom-0 mt-2 sm:right-1 sm:mt-2 bg-[#DBC166]  font-semibold px-4 py-1 rounded-lg shadow-lg text-sm sm:text-base z-20">
            <p>{timeLeft}</p>
          </div>
        )}
        {/* <div>
         <img src="/new00.webp" alt="" />
        </div> */}
        {/* hero section */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-[1400px] rounded-lg mx-auto h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden"
        >
          {/* Image Slider Background */}
          <motion.div className="absolute inset-0 rounded-lg w-full h-full z-0">
            <motion.div
              className="flex w-full h-full"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="w-full h-full aspect-[4/3] overflow-hidden rounded-lg flex-shrink-0 bg-black"
                >
                  <img
                    src={img}
                    alt={`Slide ${index}`}
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      setPortraitMap(prev => ({
                        ...prev,
                        [index]: naturalHeight > naturalWidth
                      }));
                    }}
                    className={`w-full h-full ${portraitMap[index] ? "object-contain" : "object-cover"
                      }`}
                    loading={index === currentSlide ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ))}


            </motion.div>
          </motion.div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/65 lg:bg-black/65"></div>

          {/* Content Container with Improved Responsiveness */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            {/* Inner Content Container with Safe Margins */}
            <div className="w-[85%] xs:w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] mx-auto flex flex-col items-center text-center">
              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-white text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
              >
                PAY ONLY R50, GET R500+ IN BENEFITS!{" "}
                <span className="text-[#DBC166]">BETA ACCESS OPEN!</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-xs xs:text-sm md:text-base text-white mt-2 xs:mt-3 sm:mt-4"
              >
                Get in early! Join The Menu and unlock insane vendor perks, premium discounts & bonus giveaway entries
              </motion.p>

              {/* Features List */}
              <motion.ul
                variants={staggerChildren}
                className="mt-3 xs:mt-4 space-y-1 flex flex-col justify-center items-center xs:space-y-2 sm:space-y-3 text-left w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto"
              >
                {[
                  { text: "Exclusive Partner deals", image: "/vendor.avif" },
                  { text: "Gamified rewards", image: "/game.avif" },
                  { text: "Cash prize giveaways", image: "/cash-prize.avif" },
                  { text: "Leaderboard & user rankings", image: "/trophy.avif" },
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    variants={fadeInUp}
                    className="flex items-center gap-2 xs:gap-3 md:gap-4 text-white"
                  >
                    <img src={feature.image} alt="" className="w-4 xs:w-5 sm:w-6 md:w-7 h-4 xs:h-5 sm:h-6 md:h-7" />
                    <span className="text-xs xs:text-sm md:text-base">{feature.text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA Buttons */}
              {!isPaid && (
                <div className="w-full flex flex-col items-center mt-3 xs:mt-4 sm:mt-5">
                  <motion.button
                    animate={{
                      rotate: [0, 2, -2, 0],
                      boxShadow: [
                        '0 0 0 0 rgba(219, 193, 102, 0.4)',
                        '0 0 0 15px rgba(219, 193, 102, 0)',
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                      repeatType: "loop",
                    }}
                    whileHover={{
                      scale: 1.15,
                      boxShadow: '0 4px 10px rgba(219, 193, 102, 0.3)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedAmount("R50");
                      setShowPaymentModal(true);
                    }}
                    disabled={isDisabled}
                    className={`
              bg-gradient-to-r from-[#DBC166] via-[#E5C478] to-[#EFD18A]
              text-black 
              xs:w-auto
              px-4 xs:px-6 sm:px-8 md:px-10 
              py-1.5 xs:py-2 sm:py-3 md:py-4
              rounded-full 
              text-xs xs:text-sm md:text-base 
              font-medium 
              shadow-lg
              transition-all 
              duration-300 
              ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
                  >
                    💰 Get 90% Off – Join for Just R50!
                  </motion.button>

                  <p className='font-bold text-white mt-2'>OR</p>

                  <motion.button
                    animate={{
                      rotate: [0, 2, -2, 0],
                      boxShadow: [
                        '0 0 0 0 rgba(219, 193, 102, 0.4)',
                        '0 0 0 10px rgba(219, 193, 102, 0)',
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                      repeatType: "loop",
                    }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: '0 2px 6px rgba(219, 193, 102, 0.2)',
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedAmount("R10");
                      setShowPaymentModal(true);
                    }}
                    disabled={isDisabled}
                    className={`
    bg-gradient-to-r from-[#EFD18A] via-[#E5C478] to-[#DBC166]
    text-black
    xs:w-auto 
    mt-2 
    px-3 xs:px-4 sm:px-6 md:px-8 
    py-1 xs:py-1.5 sm:py-2 md:py-2.5
    rounded-full 
    text-xs sm:text-sm 
    font-medium 
    shadow-md
    transition-all 
    duration-300 
    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
  `}
                  >
                    💰 1-Hour Access – R10!
                  </motion.button>

                </div>

              )}
            </div>
            {showPaymentModal && selectedAmount && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
                  <h2 className="text-lg font-bold mb-4">Choose Payment Method</h2>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        if (selectedAmount === "R50") {
                          handlePaymentR50("peach");
                        } else {
                          handlePaymentR10("peach");
                        }
                        setShowPaymentModal(false);
                      }}
                      className="bg-[#EFD18A] hover:bg-[#E5C478] text-black font-semibold py-2 rounded"
                    >
                      Pay with Peach
                    </button>
                    <button
                      onClick={() => {
                        toast.success("yoco clicked")
                        if (selectedAmount === "R50") {
                          handlePaymentR50("yoco");
                        } else {
                          handlePaymentR10("yoco");
                        }
                        setShowPaymentModal(false);
                      }}
                      className="bg-[#DBC166] hover:bg-[#E5C478] text-black font-semibold py-2 rounded"
                    >
                      Pay with Yoco
                    </button>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-sm text-gray-500 mt-4 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}


          </div>

          {/* Navigation Buttons - More responsive positioning */}
          <button
            onClick={prevSlide}
            className="absolute left-1 xs:left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 xs:p-2 sm:p-3 md:p-4 rounded-full shadow z-30"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 xs:right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 xs:p-2 sm:p-3 md:p-4 rounded-full shadow z-30"
          >
            ▶
          </button>
        </motion.section>

        <motion.div
          variants={staggerChildren}
          className="mt-10 text-center w-full"
        >
          {/* partner Section */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-12 text-center"
          >
            <motion.h2
              className="
    text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4
  "
            >
              Why join as a partner?
            </motion.h2>
            {/* //jk */}

            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center"
            >
              {[
                { Icon: '/p3.avif', title: "List for Free During Beta", desc: "0% Commission, High Exposure!" },
                { Icon: '/v2.avif', title: "Drive Traffic & Sales", desc: "Without Paying a Cent!" },
              ].map(({ Icon, title, desc }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
                >
                  <img src={Icon} alt="a" className={`object-contain rounded ${Icon === "/v2.avif" ? "w-20 h-20 md:w-24 md:h-24" : "w-12 h-12 md:w-16 md:h-16"
                    }`} />
                  <h3 className="font-bold mt-3">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex justify-center">
              <motion.button
                animate={{

                  rotate: [0, 2, -2, 0],
                  boxShadow: [
                    '0 0 0 0 rgba(219, 193, 102, 0.4)',
                    '0 0 0 15px rgba(219, 193, 102, 0)',
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                  repeatType: "loop"
                }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: '0 4px 10px rgba(219, 193, 102, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}

                disabled={isDisabled}
                className={`
          bg-gradient-to-r from-[#DBC166] via-[#E5C478] to-[#EFD18A]
          text-black 
        mt-4 px-6 sm:px-8 md:px-10 py-6 sm:py-6 md:py-5
          rounded-full 
          text-xs sm:text-sm md:text-base 
          font-medium 
          shadow-lg
          transition-all 
          duration-300 
          animate-flicker
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        `} style={{
                  animation: 'flicker 2s infinite',
                  color: 'var(--battlefy-white)'
                }}

                onClick={() => navigate('/vendorOnBoarding')}


              >
                BECOME A PARTNER – IT’S FREE!
              </motion.button>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-8"
            >
              {[
                { Icon: '/p4.avif', title: "Unlock Trade Promotions", desc: "& Featured Listings!" },
                { Icon: '/p2.avif', title: "FREE Beta Listing & Geolocation Exposure", desc: "Get found by paying customers." }
              ].map(({ Icon, title, desc }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
                >
                  <img src={Icon} alt="a" className="w-12 h-12 md:w-16 md:h-16 rounded" />
                  <h3 className="font-bold mt-3">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Infinite Image Slider */}
            {vendors?.length > 0 && (
              <InfiniteScroll vendors={vendors} />
            )}
          </motion.section>
          {/* Affiliates Section */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-16 text-center"
          >
            <motion.h2
              className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
            >
              Why join as an affiliate?

            </motion.h2>

            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center"
            >
              {[
                { Icon: '/p5.avif', title: "Earn 30% Commission", desc: "Get rewarded for every member you bring in!" },
                { Icon: '/p6.avif', title: "Passive Income Made Easy", desc: "Promote & earn effortlessly." }
              ].map(({ Icon, title, desc }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
                >
                  <img src={Icon} alt="a" className="w-12 h-12 md:w-16 md:h-16 rounded bg-white" />
                  <h3 className="font-bold mt-3">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex justify-center"
            >

            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex justify-center">
              <motion.button
                animate={{

                  rotate: [0, 2, -2, 0],
                  boxShadow: [
                    '0 0 0 0 rgba(219, 193, 102, 0.4)',
                    '0 0 0 15px rgba(219, 193, 102, 0)',
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                  repeatType: "loop"
                }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: '0 4px 10px rgba(219, 193, 102, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}

                disabled={isDisabled}
                className={`
            bg-gradient-to-r from-[#DBC166] via-[#E5C478] to-[#EFD18A]
            text-black 
             mt-4 px-6 sm:px-8 md:px-10 py-6 sm:py-6 md:py-5
            rounded-full 
            text-xs sm:text-sm md:text-base 
            font-medium 
            shadow-lg
            cursor-pointer
            transition-all 
            duration-300 
            animate-flicker
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          `} style={{
                  animation: 'flicker 2s infinite',
                  color: 'var(--battlefy-white)'
                }}
                onClick={() => navigate('/affiliated/register')}

              >
                START EARNING TODAY!
              </motion.button>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-8"
            >
              {[
                { Icon: '/p8.avif', title: "Top Affiliates Get VIP Perks", desc: "Enjoy exclusive access & rewards." },
                { Icon: '/p7.avif', title: "Live Performance Tracking", desc: "Monitor your earnings in real-time." }
              ].map(({ Icon, title, desc }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
                >
                  <img src={Icon} alt="a" className="w-12 h-12 md:w-16 md:h-16 rounded" />
                  <h3 className="font-bold mt-3">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>


          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-16 text-center"
          >
            <motion.h2
              className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
            >
              Why Join? – Unlocking The Menu's Perks
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 text-center m-12 max-w-3xl mx-auto"
            >
              Join our growing community and unlock exclusive benefits tailored for users, Partner, and affiliates.
            </motion.p>

            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16"
            >
              {[
                { Icon: Users, title: "For Users", desc: "Exclusive savings, giveaways, and interactive rewards." },
                { Icon: ShoppingBag, title: "For Partners", desc: "More customers, more exposure, 0% commission." },
                { Icon: Gift, title: "For Affiliates", desc: "Earn up to 30% commission promoting The Menu." }
              ].map(({ Icon, title, desc }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
                >
                  <Icon className="text-[#DBC166] w-10 h-10" />
                  <h3 className="font-bold mt-3">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md p-8 text-center max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-[#DBC166] mr-2" />
                <h2 className="text-2xl font-bold">Premium Features Await</h2>
              </div>
              <p className="text-gray-600 text-lg">
                What's behind the locked area? Even bigger prizes, premium features, and vendor-sponsored rewards.
                <span className="font-semibold text-[#DBC166]"> But only Beta Members get first access.</span>
              </p>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8"
            >
              {[
                // Only include the first button if !isPaid
                ...(!isPaid ? [{
                  text: "🔥 Claim R50 Beta Access – 90% Off Early Access!",
                  path: "/Signup",
                  special: true,
                }] : []),
                // Always include these buttons
                {
                  text: "🤝 Become a Partner – FREE Beta Onboarding!",
                  path: "/vendorOnBoarding",
                },
                {
                  text: "💰 Join as a Marketing Affiliate – Earn up to 30%!",
                  path: "/affiliated/register",
                },
              ].map((btn, index) => (
                <motion.button
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(219, 193, 102, 0.4)",
                      "0 0 0 15px rgba(219, 193, 102, 0)",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut",
                    repeatType: "loop",
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isDisabled}
                  className={`
        relative overflow-hidden
        ${btn.special
                      ? "bg-gradient-to-r from-[#EAAA00] via-[#FFC107] to-[#FFD54F]"
                      : "bg-gradient-to-r from-[#DBC166] via-[#E5C478] to-[#EFD18A]"
                    }
        text-black 
        mt-4 px-6 sm:px-8 py-3 sm:py-4
        rounded-full 
        text-xs sm:text-sm md:text-base 
        font-semibold 
        shadow-xl
        cursor-pointer
        transition-all 
        duration-300 
        animate-flicker
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        hover:scale-105 hover:shadow-2xl
      `}
                  style={{
                    animation: "flicker 2s infinite",
                    color: "var(--battlefy-white)",
                  }}
                  key={index}
                  onClick={() => navigate(btn.path)}
                >
                  {btn.text}
                  <span className="absolute inset-0 bg-white opacity-10 rounded-full scale-0 transition-transform duration-300 hover:scale-150"></span>
                </motion.button>
              ))}
            </motion.div>


          </motion.section>


          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-18 text-center p-4 sm:p-6"
          >
            {/* Heading */}
            <motion.h2
              className="text-gray-900 bg-[#DBC166] 
      px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
      text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
      font-extrabold text-center 
      rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
      flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
            >
              Social Impact
            </motion.h2>

            {/* First Two Features */}
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              id='social'
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 p-3 mx-auto max-w-4xl"
            >
              {[
                { title: "Maximizing Value", desc: "Helping South Africans get more for their money." },
                { title: "Empowering Entrepreneurs", desc: "Supporting local businesses with zero marketing costs." }
              ].map(({ title, desc }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center shadow-lg shadow-[#dbc2666a] rounded-lg border-0 outline-0 hover:scale-105 transition-transform duration-300 p-4"
                >
                  <h3 className="font-bold text-lg mt-3">{title}</h3>
                  <p className="text-gray-600 text-sm md:text-base max-w-xs">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Centered Quote */}
            <motion.div variants={fadeInUp} className="mt-12 flex justify-center px-4">
              <motion.p
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-black px-6 py-4 md:px-10 italic md:py-6 rounded-lg text-base md:text-lg font-semibold transition-all duration-300 max-w-xl bg-gray-100"
              >
                "The Menu isn’t just about deals – it’s about making every rand go further. By joining, you’re boosting local businesses and shaping a fairer economy."
              </motion.p>
            </motion.div>

            {/* Last Two Features */}
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 p-3 mx-auto max-w-4xl"
            >
              {[
                { Icon: '/p7.avif', title: "Stronger Communities", desc: "Redirecting spending to benefit local economies." },
                { Icon: '/p8.avif', title: "Fair & Inclusive Rewards", desc: "Ensuring users, businesses, and affiliates all win." }
              ].map(({ title, desc }, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex flex-col items-center shadow-lg shadow-[#dbc2666a] rounded-lg border-0 outline-0 hover:scale-105 transition-transform duration-300 p-4"
                >
                  <h3 className="font-bold text-lg mt-3">{title}</h3>
                  <p className="text-gray-600 text-sm md:text-base max-w-xs">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>




          {isAuth ? (
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Referral Program Section */}
              <motion.section className="mt-12 w-full text-center bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8" variants={fadeInUp} initial="hidden" animate="visible">
                <motion.h2
                  className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >
                  Earn Rewards with Our Referral Program!
                </motion.h2>

                <motion.div className="mt-12 w-full space-y-12" variants={staggerChildren} initial="hidden" animate="visible">
                  {/* Referral Link */}
                  <motion.div className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6 bg-gray-50 rounded-xl p-6 " variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Referral link generation</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">
                        Users can share personalized links for referrals
                      </p>
                    </div>
                    <motion.img
                      src="/RefLink.webp"
                      alt="Dynamic Leaderboards"
                      width={300}
                      height={150}
                      className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 object-cover"
                      variants={scaleUp}
                    />
                  </motion.div>

                  {/* Milestone Tracking */}
                  <motion.div className="w-full flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 bg-gray-50 rounded-xl p-6 " variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Milestone tracking</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">
                        Progress indicators show referral achievements
                      </p>
                    </div>
                    <motion.img
                      src="/milestone.avif"
                      alt="Milestone Tracking"
                      width={300}
                      height={150}
                      className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 object-cover"
                      variants={scaleUp}
                    />
                  </motion.div>

                  {/* Dynamic Leaderboards */}
                  <motion.div className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6 bg-gray-50 rounded-xl p-6 shadow-md" variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Dynamic leaderboards</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">
                        Display top referrers to foster competition
                      </p>
                    </div>
                    <motion.img
                      src="/dynamicLead.avif"
                      alt="Dynamic Leaderboards"
                      width={300}
                      height={150}
                      className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 object-cover"
                      variants={scaleUp}
                    />
                  </motion.div>
                </motion.div>
              </motion.section>

              {/* Gamified Elements Section */}
              <motion.section className=" w-full text-center bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8" variants={fadeInUp} initial="hidden" animate="visible">
                <motion.h2
                  className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >
                  Gamified Elements
                </motion.h2>

                <div className="flex flex-col items-center justify-center gap-12 mt-12 w-full">
                  <p className="mt-2 text-base sm:text-base md:text-xl text-gray-600">
                    Users earn points and rewards by achieving milestones
                  </p>
                  <h3 className="font-bold text-3xl flex items-center justify-center">
                    Leaderboards
                  </h3>
                </div>

                <div className="w-full flex items-center justify-center">
                  <Lapboard />
                </div>
              </motion.section>

              {/* SpinWheel Section */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 w-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
                <motion.h2
                  className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >
                  Try Your Luck & Spin the Wheel!
                </motion.h2>
                <SpinWheel />
              </motion.section>

              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-10 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
                <motion.h2
                  className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >
                  Countdown Timers for Ongoing Raffles and Games
                </motion.h2>

                <RankCard />
              </motion.section>

              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
                <motion.h2
                  className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >

                  Weekly Raffles
                </motion.h2>
                <WeeklyRaffles />
              </motion.section>

              {/* Dynamic Advertising Section */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
                <motion.h2
                  className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >
                  Dynamic Advertising Banners
                </motion.h2>
                <div className="mt-6">
                  <CampaignPerformance />
                </div>
              </motion.section>

              {/* Stats Section */}
              <motion.section
                variants={staggerChildren}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
                <section className="flex flex-col md:flex-row justify-center gap-6 py-10">
                  <motion.div variants={scaleUp}>
                    <StatCard end={7000} label="User Registered" />
                  </motion.div>
                  <motion.div variants={scaleUp}>
                    <StatCard end={10000} label="Referrals" />
                  </motion.div>
                  <motion.div variants={scaleUp}>
                    <StatCard end={50000} label="Happy Clients" />
                  </motion.div>
                </section>
              </motion.section>

              {/* Affiliate Marketing Section */}
              <motion.section className="mt-8 w-full text-center bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8" variants={fadeInUp} initial="hidden" animate="visible">
                <motion.h2
                  className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >
                  Affiliate Marketing System
                </motion.h2>
                <div className="flex flex-col items-center gap-6 mt-6 w-full">
                  <p className="text-base sm:text-base md:text-xl max-w-2xl text-gray-600">
                    Empower affiliates to grow and earn with ease through advanced tools and insights.
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-5xl">
                    <div className="flex flex-col items-center text-center w-full md:w-1/2 bg-gray-50 rounded-xl p-6 shadow-md">
                      <h2 className="text-lg font-semibold">Automatic Referral Code Generation</h2>
                      <img
                        src="/referral.webp"
                        alt="Referral"
                        width={160}
                        height={160}
                        className="rounded-xl bg-transparent mt-4"
                      />
                      <p className="mt-2 text-base sm:text-base md:text-base">
                        Each affiliate gets a unique referral code to track their performance and maximize conversions.
                      </p>
                    </div>

                    <div className="hidden md:block h-24 w-[1px] bg-gray-400"></div>

                    <div className="flex flex-col items-center text-center w-full md:w-1/2 bg-gray-50 rounded-xl p-6 shadow-md">
                      <h2 className="text-lg font-semibold">Affiliate Dashboard</h2>
                      <img
                        src="/clock.webp"
                        alt="Affiliate Dashboard"
                        width={160}
                        height={160}
                        className="rounded-xl bg-transparent mt-4"
                      />
                      <p className="mt-2 text-base sm:text-base md:text-base text-gray-600">
                        A user-friendly dashboard for affiliates to monitor and manage their performance.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Additional Update Section */}
              <motion.section
                className="mt-12 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 sm:p-8"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <motion.h2
                  className="text-gray-900 bg-[#DBC166] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
               text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center 
               rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 flex flex-col sm:flex-row 
               items-center justify-center gap-2 sm:gap-4"
                >
                  Additional Update
                </motion.h2>

                <div className="mt-6">
                  <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-10 py-6 sm:py-12">

                    {/* Competition Entries Card */}
                    <div className="border border-gray-300 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src="/trophy.avif"
                        alt="Competition Icon"
                        width={80}
                        height={80}
                        className="w-16 sm:w-20 mx-auto mb-4 sm:mb-6"
                      />
                      <h2 className="text-xl sm:text-2xl font-bold text-center">Competition Entries</h2>
                      <ul className="mt-4 text-gray-700 text-sm sm:text-lg space-y-3">
                        <li>▪️ <strong>Subscriptions:</strong> Entries per competition are based on the tier (e.g., Lion Plan = 10 entries/competition).</li>
                        <li>▪️ <strong>Day Passes:</strong> Allocate entries according to the once-off pass type and entries allocated per type.</li>
                        <li>▪️ User dashboards must display competition names, earned entries, and usage history.</li>
                      </ul>
                    </div>

                    {/* Membership Offer Card */}
                    <div className="border border-gray-300 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src="/exclusive.avif"
                        alt="Membership Icon"
                        width={200}
                        height={200}
                        className="w-16 sm:w-20 mx-auto mb-4 sm:mb-6"
                      />
                      <h2 className="text-xl sm:text-2xl font-bold text-center">Free Membership Offer</h2>
                      <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600">
                        Users who pay the R50 access fee during the Waiting Page period will automatically receive one free month of the Lion Plan when the full platform launches. This process will be automated, with clear communication to users.
                      </p>
                    </div>

                  </div>
                </div>
              </motion.section>

            </motion.div>
          ) : (
            <motion.div
              onClick={() => navigate('/Signup')}
              variants={fadeInUp}
              className="flex flex-col items-center justify-center cursor-pointer transition-transform 5"
            >

              <motion.div
                variants={scaleUp}
                className="sticky top-0 z-50 bg-white w-full flex flex-col items-center justify-center px-4 py-4 md:py-6 lg:py-8 text-center"
              >

              </motion.div>

              <motion.div
                ref={sectionRef}
                className="p-5 w-full pointer-events-none select-none relative"
                aria-hidden="true"
              >

                <motion.section className="mt w-full text-center">

                  <motion.h2
                    className="  text-gray-900 bg-[#DBC166] 
    px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-extrabold text-center 
    rounded-lg shadow-md mb-6 sm:mb-8 md:mb-10 
    flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                  >
                    Gamified Elements
                  </motion.h2>
                  <div className="flex flex-col items-center justify-center gap-12 mt-12 w-full">
                    <p className="mt-2 text-base sm:text-base md:text-xl text-gray-600">
                      Users earn points and rewards by achieving milestones
                    </p>
                    <h3 className="font-bold text-3xl flex items-center justify-center">
                      Leaderboards
                    </h3>
                  </div>

                  <div className="w-full flex items-center justify-center">
                    <Lapboard />
                  </div>

                  <div className="w-full flex items-center justify-center mt-8">
                    <SpinWheel />
                  </div>
                </motion.section>

                {/* Teaser Text */}

              </motion.div>

            </motion.div>

          )}

        </motion.div>

      </motion.main >

      <motion.div
        className=" w-full p-5 bg-white bg-opacity-90 text-center rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}

      >
        <motion.p
          className="text-base sm:text-xl font-semibold text-gray-600 relative z-10"

        >
          Early Access Members Get the First Look & First Pick at the Biggest Rewards in SA. Don’t Miss Out!
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate('signup')}
          animate={{

            rotate: [0, 2, -2, 0],
            boxShadow: [
              '0 0 0 0 rgba(219, 193, 102, 0.4)',
              '0 0 0 15px rgba(219, 193, 102, 0)',
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
            repeatType: "loop"
          }}
          whileHover={{
            scale: 1.15,
            boxShadow: '0 4px 10px rgba(219, 193, 102, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}

          disabled={isDisabled}
          className={`
    bg-gradient-to-r from-[#DBC166] via-[#E5C478] to-[#EFD18A]
    text-black 
    mt-4 px-5 sm:px-7 py-2 sm:py-3
    rounded-full 
    text-xs sm:text-sm md:text-base 
    font-medium 
    shadow-lg
    transition-all 
    duration-300 
    animate-flicker
    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
  `}
          style={{
            animation: 'flicker 2s infinite',
            color: 'var(--battlefy-white)'
          }}
        >
          🔥UNLOCK YOUR REWARDS – SIGN UP NOW
        </motion.button>
      </motion.div>

    </>
  );
}