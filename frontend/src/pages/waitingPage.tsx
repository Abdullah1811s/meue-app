
import { motion } from 'framer-motion';
import Button from "../components/ui/button";
import { StatCard } from "../components/customComponents/StatCard";
import TitleCard from "../components/customComponents/TitleCard";
import Lapboard from "../components/customComponents/Lapboard";
import RankCard from "../components/customComponents/RankCard";
import WeeklyRaffles from "../components/customComponents/WeeklyRaffles";
import CampaignPerformance from "../components/customComponents/CampaignPerformance";
import SpinWheel from "../components/customComponents/SpinWheel";
import { Gift, ShoppingBag, Trophy, Megaphone, DollarSign, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/customComponents/NavbarComponent";
import { useSelector } from "react-redux";
import Footer from '../components/customComponents/Footer';

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

export default function Home() {
  const isAuth = useSelector((state: any) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  return (
    <>
      <NavbarComponent />
      <motion.main
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-2 w-full max-w-7xl mx-auto"
      >
        <motion.section
          initial="hidden"
          animate="visible"
          className="py-10 md:py-16"
        >
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerChildren}
              className="flex flex-col lg:flex-row items-center justify-between gap-6"
            >
              {/* Left Content */}
              <motion.div
                variants={slideIn}
                className="flex-1 text-center lg:text-left"
              >
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                >
                  Claim Your <span className="text-[#DBC166]">R50</span> Early Access
                  <br />& Join The Beta Experience!
                </motion.h1>

                <motion.div variants={staggerChildren} className="mt-6 space-y-4">
                  <motion.p variants={fadeInUp} className="text-lg text-gray-600">
                    Sign up today and receive:
                  </motion.p>
                  <motion.ul
                    variants={staggerChildren}
                    className="space-y-2 text-left max-w-md mx-auto lg:mx-0"
                  >
                    {[
                      "1 Month FREE Lion Membership (R500 Value)",
                      "1,000 Leaderboard Points",
                      "Exclusive Early-Bird Deals",
                      "Shape The Menu Platform!",
                    ].map((benefit, index) => (
                      <motion.li
                        key={index}
                        variants={fadeInUp}
                        className="flex items-center gap-2"
                      >
                        <span className="text-green-500">✓</span>
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>

                {/* Timer */}
                <motion.div
                  variants={scaleUp}
                  className="mt-6 p-3 bg-gray-50 rounded-lg inline-block"
                >
                  <p className="text-sm text-gray-600 mb-1">Beta Access Offer Ends in:</p>
                  <p className="text-2xl font-bold text-gray-800">60 Days</p>
                </motion.div>

                {/* CTA Button */}
                <motion.div variants={fadeInUp} className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("Signup")}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#fbd23f] hover:bg-[#DBC166] text-black px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    🔥 Claim Early Access for R50
                  </motion.button>

                </motion.div>
                <div className='flex gap-3'>
                  <motion.div variants={fadeInUp} className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/affiliated/register')}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-2 border-[#fbd23f] text-black px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      Affiliate Register
                    </motion.button>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/vendorOnBoarding')}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-2 border-[#fbd23f] text-black px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      Vendor Register
                    </motion.button>
                  </motion.div>
                </div>

              </motion.div>

              {/* Right Image */}
              <motion.div variants={scaleUp} className="w-[60%] lg:w-[50%] flex">
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src="/LaptopCart.jpg"
                  alt="Beta Platform Preview"
                  className="rounded-2xl shadow-2xl w-full max-w-2xl"
                />
              </motion.div>

            </motion.div>
          </div>
        </motion.section>


        <motion.div
          variants={staggerChildren}
          className="mt-10 text-center w-full"
        >
          <motion.section
            variants={fadeInUp}
            className="mt-12 w-full text-center"
          >
            <TitleCard title="Become a Vendor & Grow Your Business" IconComponent={ShoppingBag} />
            <motion.div
              variants={staggerChildren}
              className="flex flex-col items-center justify-center gap-12 mt-12"
            >
              <motion.p
                variants={fadeInUp}
                className="mt-2 sm:text-xl md:text-xl max-w-4xl mx-auto"
              >
                Register your business with The Menu Portal to reach more customers, showcase your offerings, and access exclusive tools like a personalized dashboard and automated contracts. Join today and grow with us!
              </motion.p>
              <motion.div
                variants={scaleUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate('/vendorOnBoarding')}
                  text="Join as a Vendor Get Free Exposure!"
                  className="w-fit sm:w-fit bg-[#fbd23f] text-black px-6 py-4 sm:py-5 text-base sm:text-lg rounded-full font-medium transition-all duration-300 ease-in-out hover:bg-[#C0B060] hover:shadow-lg"
                />
              </motion.div>
            </motion.div>
          </motion.section>
          {isAuth ? (
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Vendor Section */}


              {/* Referral Program Section */}
              <motion.section className="mt-12 w-full text-center" variants={fadeInUp} initial="hidden" animate="visible">
                <motion.div variants={fadeInUp}>
                  <TitleCard title="Earn Rewards with Our Referral Program!" IconComponent={Gift} />
                </motion.div>
                <motion.div className="mt-12 w-full space-y-12" variants={staggerChildren} initial="hidden" animate="visible">
                  {/* Referral Link */}
                  <motion.div className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6" variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Referral link generation</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg">
                        Users can share personalized links for referrals
                      </p>
                    </div>
                    <motion.img
                      src="/RefLink.jpg"
                      alt="Dynamic Leaderboards"
                      width={300} // Reduce width
                      height={150} // Reduce height to match width
                      className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 object-cover"
                      variants={scaleUp}
                    />
                  </motion.div>

                  {/* Milestone Tracking */}
                  <motion.div className="w-full flex flex-col md:flex-row-reverse items-center md:justify-between gap-6" variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Milestone tracking</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg">
                        Progress indicators show referral achievements
                      </p>
                    </div>
                    <motion.img
                      src="/milestone.png"
                      alt="Milestone Tracking"
                      width={300} // Reduce width
                      height={150} // Reduce height to match width
                      className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 object-cover"
                      variants={scaleUp}
                    />
                  </motion.div>

                  {/* Dynamic Leaderboards */}
                  <motion.div className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6" variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Dynamic leaderboards</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg">
                        Display top referrers to foster competition
                      </p>
                    </div>
                    <motion.img
                      src="/dynamicLead.jpg"
                      alt="Dynamic Leaderboards"
                      width={300} // Reduce width
                      height={150} // Reduce height to match width
                      className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 object-cover"
                      variants={scaleUp}
                    />

                  </motion.div>
                </motion.div>
              </motion.section>

              {/* Gamified Elements Section */}
              <motion.section className="mt-12 w-full text-center" variants={fadeInUp} initial="hidden" animate="visible">
                <TitleCard title="Gamified Elements" IconComponent={Trophy} />
                <div className="flex flex-col items-center justify-center gap-12 mt-12 w-full">
                  <p className="mt-2 text-base sm:text-base md:text-xl">
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
                className="mt-12 w-full flex items-center justify-center"
              >
                <SpinWheel />
              </motion.section>

              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-10 w-full"
              >
                <RankCard />
              </motion.section>

              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 w-full"
              >
                <WeeklyRaffles />
              </motion.section>

              {/* Dynamic Advertising Section */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 w-full"
              >
                <TitleCard title="Dynamic Advertising Banners" IconComponent={Megaphone} />
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
                className="mt-12 w-full"
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
              <motion.section className="mt-8 w-full text-center" variants={fadeInUp} initial="hidden" animate="visible">
                <TitleCard title="Affiliate Marketing System" IconComponent={DollarSign} />
                <div className="flex flex-col items-center gap-6 mt-6 w-full">
                  <p className="text-base sm:text-base md:text-xl max-w-2xl">
                    Empower affiliates to grow and earn with ease through advanced tools and insights.
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-5xl">
                    <div className="flex flex-col items-center text-center w-full md:w-1/2">
                      <h2 className="text-lg font-semibold">Automatic Referral Code Generation</h2>
                      <img
                        src="/referral.png"
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

                    <div className="flex flex-col items-center text-center w-full md:w-1/2">
                      <h2 className="text-lg font-semibold">Affiliate Dashboard</h2>
                      <img
                        src="/clock.png"
                        alt="Affiliate Dashboard"
                        width={160}
                        height={160}
                        className="rounded-xl bg-transparent mt-4"
                      />
                      <p className="mt-2 text-base sm:text-base md:text-base">
                        A user-friendly dashboard for affiliates to monitor and manage their performance.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Additional Update Section */}
              <motion.section className="mt-12 w-full" variants={fadeInUp} initial="hidden" animate="visible">
                <TitleCard
                  title="Additional Update"
                  IconComponent={Bell}
                />
                <div className="mt-10">
                  <div className="flex flex-col md:flex-row justify-center gap-10 py-12">
                    <div className="border border-gray-300 rounded-2xl p-8 w-96 shadow-xl bg-white">
                      <img
                        src="/trophy.png"
                        alt="Competition Icon"
                        width={80}
                        height={80} className="w-20 mx-auto mb-6"
                      />

                      <h2 className="text-2xl font-bold text-center">Competition Entries</h2>
                      <ul className="mt-4 text-gray-700 text-lg space-y-3">
                        <li>▪️ <strong>Subscriptions:</strong> Entries per competition are based on the tier (e.g., Lion Plan = 10 entries/competition).</li>
                        <li>▪️ <strong>Day Passes:</strong> Allocate entries according to the once-off pass type and entries allocated per type.</li>
                        <li>▪️ User dashboards must display competition names, earned entries, and usage history.</li>
                      </ul>
                    </div>
                    <div className="border border-gray-300 rounded-2xl p-8 w-96 shadow-xl bg-white">
                      <img src="/exclusive.png" alt="Membership Icon" width={200} height={200} className="w-20 mx-auto mb-6" />
                      <h2 className="text-2xl font-bold text-center">Free Membership Offer</h2>
                      <p className="mt-4 text-sm sm:text-base md:text-lg">
                        Users who pay the R50 access fee during the Waiting Page period will automatically receive one free month of the Lion Plan when the full platform launches. This process will be automated, with clear communication to users.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

            </motion.div>
          ) : (
            // Locked Content Section with smooth blur transition
            <motion.div
              variants={fadeInUp}
              className="relative flex items-center justify-center flex-col"
            >
              <motion.div
                variants={scaleUp}
                className="sticky top-0 z-50 bg-white w-full flex flex-col items-center justify-center px-4 py-4 md:py-6 lg:py-8 text-center"
              >
                <motion.img
                  src="/lock.png"
                  alt="Logo"
                  className="w-24 md:w-32 lg:w-40 h-auto"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <motion.h2
                  variants={fadeInUp}
                  className="text-lg md:text-xl lg:text-2xl font-bold max-w-[90%] md:max-w-[80%]"
                >
                  This section is locked. Please register to continue.
                </motion.h2>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="blur-[10px] bg-white/30 p-5"
                initial={{ filter: "blur(0px)" }}
                animate={{ filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-[500px] w-full bg-gray-200 rounded-lg"></div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.main>
      <Footer />
    </>
  );
}