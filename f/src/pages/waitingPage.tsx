
import { motion, useInView } from 'framer-motion';

import { StatCard } from "../components/customComponents/StatCard";
import TitleCard from "../components/customComponents/TitleCard";
import Lapboard from "../components/customComponents/Lapboard";
import RankCard from "../components/customComponents/RankCard";
import WeeklyRaffles from "../components/customComponents/WeeklyRaffles";
import CampaignPerformance from "../components/customComponents/CampaignPerformance";
import SpinWheel from "../components/customComponents/SpinWheel";
import { Gift, ShoppingBag, Trophy, Megaphone, DollarSign, Bell, Star, Briefcase, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/customComponents/NavbarComponent";
import { useSelector } from "react-redux";
import Footer from '../components/customComponents/Footer';
import { Users, Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-xl p-6 flex flex-col items-center text-center transform transition-all duration-300 "
    >
      <div className="w-16 h-16 bg-[#DBC166]  rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 " />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export default function Home() {
  // Beta Version Expiration Time (Set a target date/time)
  const betaEndTime = new Date("2024-08-30T23:59:59").getTime(); // Example: Ends on August 30, 2024

  // Timer State for Countdown
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const timeRemaining = Math.abs(betaEndTime - now); // Take absolute value

      if (timeRemaining <= 0) {
        setTimeLeft("Beta Expired");
        return;
      }

      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
      const seconds = Math.floor((timeRemaining / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [betaEndTime]);

  const isAuth = useSelector((state: any) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  return (
    <>
      <NavbarComponent />
      <motion.main
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-2 w-full max-w-7xl mx-auto"
      > <div className="fixed top-4 right-4 bg-[#DBC166] text-black px-3 py-1 rounded-full font-semibold text-sm md:text-base shadow-md">
          Timer: {timeLeft}s
        </div>

        {/* hero section */}
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
              {/* Right Image - Interactive Preview */}
              <motion.div variants={scaleUp} className="w-[90%] lg:w-[50%] lg:order-last flex relative">
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src="/LaptopCart.jpg"
                  alt="Beta Platform Preview"
                  className="rounded-2xl shadow-2xl w-full max-w-2xl"
                />
              </motion.div>

              {/* Left Content - Hero Section */}
              <motion.div
                variants={slideIn}
                className="flex-1 text-center lg:text-left"
              >
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                >
                  90% OFF Beta Access! <span className="text-[#DBC166]">Get R500+ Worth</span>
                  <br /> of Savings for Just R50!
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-gray-600 mt-4"
                >
                  Join South Africa's first interactive rewards platform – where you win, vendors win, and everyone benefits.
                </motion.p>

                <motion.ul
                  variants={staggerChildren}
                  className="mt-4 space-y-4 text-left max-w-md mx-auto lg:mx-0"
                >
                  {[{
                    text: "Exclusive vendor deals",
                    image: "/vendor.png"
                  }, {
                    text: "Gamified rewards",
                    image: "/game.png"
                  }, {
                    text: "Cash prize giveaways",
                    image: "/cash-prize.png"
                  }, {
                    text: "Leaderboard & user rankings",
                    image: "/trophy.png"
                  }].map((feature, index) => (
                    <motion.li
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center gap-4"
                    >
                      <img src={feature.image} alt="" className="w-8 h-8" />
                      <span>{feature.text}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* CTA Button - High Impact */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#DBC166] hover:bg-[#DBC166] text-black mt-4 px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 relative z-10"
                >
                  💰 Get 90% Off – Join for Just R50!

                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>


        <motion.div
          variants={staggerChildren}
          className="mt-10 text-center w-full"
        >
          <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="mt-12">
            <TitleCard title="Become a Vendor & Grow Your Business" IconComponent={ShoppingBag} />
            <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="flex flex-col md:flex-row items-center justify-between gap-12 mt-12 py-6">
              <motion.div variants={slideIn} className="md:w-1/2 text-left">
                <ul className="text-gray-700 text-lg space-y-3">
                  <li>✅ <strong>List for Free During Beta</strong> – 0% Commission, High Exposure!</li>
                  <li>✅ <strong>Drive Traffic & Sales</strong> Without Paying a Cent!</li>
                  <li>✅ <strong>Unlock Trade Promotions</strong> & Featured Listings!</li>
                  <li>✅ <strong>FREE Beta Listing & Geolocation Exposure</strong> – Get found by paying customers.</li>
                  <li>✅ <strong>Engagement-Based Growth</strong> – Earn bonus ad slots & free promotions.</li>
                </ul>
              </motion.div>
              <motion.div variants={scaleUp} className="md:w-1/2 flex justify-center">
                <motion.button
                  onClick={() => navigate('/vendorOnBoarding')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}

                  className="bg-[#DBC166] hover:bg-[#CBA855] text-black mt-4 px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
                >
                  BECOME A PARTNER – IT’S FREE!
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.section>
          {/* Affiliates Section */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-16 max-w-5xl mx-auto px-6"
          >
            {/* Title Section */}
            {/* <TitleCard title="Become an Affiliate & Start Earning" IconComponent={DollarSign} /> */}
            <motion.h2
              className="text-gray-900 bg-[#DBC166] px-6 py-4 text-4xl font-extrabold text-center rounded-lg shadow-md mb-10 flex items-center justify-center gap-4"
            >
              <DollarSign className="w-10 h-10 text-[#000000]" />
              Become an Affiliate & Start Earning
            </motion.h2>


            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-12 py-6"
            >
              {/* Top Features Section */}
              <motion.div variants={slideIn} className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { Icon: DollarSign, title: "Earn 30% Commission", desc: "Get rewarded for every member you bring in!" },
                  { Icon: Briefcase, title: "Passive Income Made Easy", desc: "Promote & earn effortlessly." }
                ].map(({ Icon, title, desc }, index) => (
                  <div key={index} className="p-8 bg-white rounded-xl  flex flex-col items-center text-center transition-all hover:scale-105">
                    <Icon className="w-14 h-14 text-[#DBC166] mb-4" />
                    <strong className="text-xl font-semibold">{title}</strong>
                    <p className="text-gray-700 mt-2">{desc}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={scaleUp} className="w-full flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/affiliated/register')}
                  className="bg-[#DBC166] hover:bg-[#CBA855] text-black px-8 py-4 rounded-full text-xl font-bold shadow-xl transition-all duration-300"
                >
                  START EARNING TODAY!
                </motion.button>
              </motion.div>

              {/* Bottom Features Section */}
              <motion.div variants={slideIn} className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { Icon: Gift, title: "Top Affiliates Get VIP Perks", desc: "Enjoy exclusive access & rewards." },
                  { Icon: BarChart, title: "Live Performance Tracking", desc: "Monitor your earnings in real-time." }
                ].map(({ Icon, title, desc }, index) => (
                  <div key={index} className="p-8 bg-white rounded-xl flex flex-col items-center text-center transition-all hover:scale-105">
                    <Icon className="w-14 h-14 text-[#DBC166] mb-4" />
                    <strong className="text-xl font-semibold">{title}</strong>
                    <p className="text-gray-700 mt-2">{desc}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.section>


          <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="container mx-auto px-4">
            <TitleCard title="Why Join? – Unlocking The Menu's Perks" IconComponent={Star} />

            <motion.p variants={fadeInUp} className="text-xl text-gray-600 text-center m-12 max-w-3xl mx-auto">
              Join our growing community and unlock exclusive benefits tailored for users, vendors, and affiliates.
            </motion.p>

            <motion.div variants={staggerChildren} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <FeatureCard icon={Users} title="For Users" description="Exclusive savings, giveaways, and interactive rewards." />
              <FeatureCard icon={ShoppingBag} title="For Vendors" description="More customers, more exposure, 0% commission." />
              <FeatureCard icon={Gift} title="For Affiliates" description="Earn up to 30% commission promoting The Menu." />
            </motion.div>

            <motion.div variants={scaleUp} className="bg-white rounded-xl shadow-md p-8 text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-[#DBC166] mr-2" />
                <h2 className="text-2xl font-bold">Premium Features Await</h2>
              </div>
              <p className="text-gray-600 text-lg">
                What's behind the locked area? Even bigger prizes, premium features, and vendor-sponsored rewards.
                <span className="font-semibold text-[#DBC166]"> But only Beta Members get first access.</span>
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
              {[
                { text: "🔥 Claim R50 Beta Access – 90% Off Early Access!", path: "/sign" },
                { text: "🤝 Become a Partner – FREE Beta Onboarding!", path: "/vendorOnBoarding" },
                { text: "💰 Join as a Marketing Affiliate – Earn up to 30%!", path: "/affiliated/register" },
              ].map((btn, index) => (
                <motion.button
                  key={index}
                  onClick={() => navigate(btn.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#DBC166] hover:bg-[#CBA855] text-black font-semibold px-6 py-3 rounded-full text-base shadow-md transition-all duration-300"
                >
                  {btn.text}
                </motion.button>

              ))}
            </div>
          </motion.div>

          {isAuth ? (
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Referral Program Section */}
              <motion.section className="mt-12 w-full text-center bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8" variants={fadeInUp} initial="hidden" animate="visible">
                <motion.div variants={fadeInUp}>
                  <TitleCard title="Earn Rewards with Our Referral Program!" IconComponent={Gift} />
                </motion.div>
                <motion.div className="mt-12 w-full space-y-12" variants={staggerChildren} initial="hidden" animate="visible">
                  {/* Referral Link */}
                  <motion.div className="w-full flex flex-col md:flex-row items-center md:justify-between gap-6 bg-gray-50 rounded-xl p-6 shadow-md" variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Referral link generation</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">
                        Users can share personalized links for referrals
                      </p>
                    </div>
                    <motion.img
                      src="/RefLink.jpg"
                      alt="Dynamic Leaderboards"
                      width={300}
                      height={150}
                      className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 object-cover"
                      variants={scaleUp}
                    />
                  </motion.div>

                  {/* Milestone Tracking */}
                  <motion.div className="w-full flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 bg-gray-50 rounded-xl p-6 shadow-md" variants={fadeInUp}>
                    <div className="md:w-1/2">
                      <h3 className="text-3xl font-semibold">Milestone tracking</h3>
                      <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">
                        Progress indicators show referral achievements
                      </p>
                    </div>
                    <motion.img
                      src="/milestone.png"
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
                      src="/dynamicLead.jpg"
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
              <motion.section className="mt-12 w-full text-center bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8" variants={fadeInUp} initial="hidden" animate="visible">
                <TitleCard title="Gamified Elements" IconComponent={Trophy} />
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
                className="mt-12 w-full flex items-center justify-center bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
                <SpinWheel />
              </motion.section>

              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-10 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
                <RankCard />
              </motion.section>

              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8"
              >
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
                <TitleCard title="Affiliate Marketing System" IconComponent={DollarSign} />
                <div className="flex flex-col items-center gap-6 mt-6 w-full">
                  <p className="text-base sm:text-base md:text-xl max-w-2xl text-gray-600">
                    Empower affiliates to grow and earn with ease through advanced tools and insights.
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-5xl">
                    <div className="flex flex-col items-center text-center w-full md:w-1/2 bg-gray-50 rounded-xl p-6 shadow-md">
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

                    <div className="flex flex-col items-center text-center w-full md:w-1/2 bg-gray-50 rounded-xl p-6 shadow-md">
                      <h2 className="text-lg font-semibold">Affiliate Dashboard</h2>
                      <img
                        src="/clock.png"
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
              <motion.section className="mt-12 w-full bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8" variants={fadeInUp} initial="hidden" animate="visible">
                <TitleCard
                  title="Additional Update"
                  IconComponent={Bell}
                />
                <div className="mt-10">
                  <div className="flex flex-col md:flex-row justify-center gap-10 py-12">
                    <div className="border border-gray-300 rounded-2xl p-8 w-96 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src="/trophy.png"
                        alt="Competition Icon"
                        width={80}
                        height={80}
                        className="w-20 mx-auto mb-6"
                      />

                      <h2 className="text-2xl font-bold text-center">Competition Entries</h2>
                      <ul className="mt-4 text-gray-700 text-lg space-y-3">
                        <li>▪️ <strong>Subscriptions:</strong> Entries per competition are based on the tier (e.g., Lion Plan = 10 entries/competition).</li>
                        <li>▪️ <strong>Day Passes:</strong> Allocate entries according to the once-off pass type and entries allocated per type.</li>
                        <li>▪️ User dashboards must display competition names, earned entries, and usage history.</li>
                      </ul>
                    </div>
                    <div className="border border-gray-300 rounded-2xl p-8 w-96 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src="/exclusive.png"
                        alt="Membership Icon"
                        width={200}
                        height={200}
                        className="w-20 mx-auto mb-6"
                      />
                      <h2 className="text-2xl font-bold text-center">Free Membership Offer</h2>
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
                  🌟 Become a member to access this feature!
                </motion.h2>
              </motion.div>

              <motion.div
                ref={sectionRef}
                className="p-5 w-full pointer-events-none select-none relative"
                initial={{ filter: "blur(8px)" }}
                animate={
                  isInView
                    ? { filter: ["blur(8px)", "blur(0px)", "blur(8px)"] }
                    : {}
                }
                transition={
                  isInView
                    ? {
                      duration: 3, // Total duration (smooth effect)
                      times: [0, 0.33, 1], // Unblur effect lasts for 1 sec
                      ease: ["easeInOut", "easeInOut", "easeInOut"], // Smooth transitions
                    }
                    : {}
                }
                aria-hidden="true"
              >

                <motion.section className="mt-12 w-full text-center">
                  <TitleCard title="Gamified Elements" IconComponent={Trophy} />

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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#DBC166] hover:bg-[#DBC166] text-black mt-4 px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 relative z-10 "
        >
          🔥UNLOCK YOUR REWARDS – SIGN UP NOW
        </motion.button>
      </motion.div>
      <Footer />
    </>
  );
}