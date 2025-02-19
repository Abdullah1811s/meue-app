import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import DashboardDetailCard from "../components/customComponents/DashboardDetailCard ";

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize state for API data
  const [referredBy, setReferredBy] = useState(null);
  const [userCode, setUserCode] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [user, setUser] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [payout, setPayout] = useState(null);
  const [referralCodes, setReferralCodes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error("User ID not found");
          return;
        }

        // Fetch all API data concurrently
        const [userInfo, referralDetails, userCodeResponse, allReferredUser] = await Promise.all([
          axios.get(`http://localhost:8000/api/users/${id}`).catch(() => null),
          axios.get(`http://localhost:8000/api/referral/${id}/ReferredBy`).catch(() => null),
          axios.get(`http://localhost:8000/api/referral/${id}/Code`).catch(() => null),
          axios.get(`http://localhost:8000/api/referral/${id}/referrals`).catch(() => null),
        ]);


        // Update state safely
        setUser(userInfo?.data?.user || null);
        setUserCode(userCodeResponse?.data?.referralCode || null);
        setReferredBy(referralDetails?.data?.referrer || "Not Available");
        setReferrals(allReferredUser?.data?.referrals || []);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id]);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        whileHover={{ scale: 1.1 }} // Scale on hover
        whileTap={{ scale: 0.95 }}  // Slight shrink on tap
      >
        Back to Home
      </motion.button>

      <motion.h1
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Affiliate Dashboard
      </motion.h1>

      {user && (
        <motion.div
          className="bg-white p-4 rounded-lg shadow-md mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">You'r Details:</h2>
          <p><strong>Name:</strong> {user?.name || "no details"}</p>
          <p><strong>Email:</strong> {user?.email || "no details"}</p>
          <p><strong>Phone Number:</strong> {user?.phone || "no details"}</p>
        </motion.div>
      )}

      {referredBy && (
        <motion.div
          className="bg-white p-4 rounded-lg shadow-md mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">Referred By:</h2>
          {referredBy?.name && referredBy?.email ? (
            <>
              <p><strong>Name:</strong> {referredBy.name}</p>
              <p><strong>Email:</strong> {referredBy.email}</p>
            </>
          ) : (
            <p> Not referred by anyone</p>
          )}


        </motion.div>
      )}


      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <DashboardDetailCard title="Earnings" value={earnings?.total} />
        <DashboardDetailCard title="Payout Status" value={payout?.status || "Pending"} />
        <DashboardDetailCard title="My referral code" value={userCode} />
        {/* <DashboardDetailCard title="Referred By" value={userCode} /> */}


      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-lg shadow-md mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold">Referrals</h2>
        <ul>
          {referrals.map((ref) => (
            <motion.li
              key={ref?.user?._id} // Use the user's _id as a unique key
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gray-100 rounded-lg mb-2 shadow"
            >
              <p><strong>Name:</strong> {ref.user.name}</p>
              <p><strong>Email:</strong> {ref.user.email}</p>
              <p><strong>Referral Code:</strong> {ref.referralCode}</p>
            </motion.li>
          ))}
        </ul>

      </motion.div>
    </div>
  );
};

export default Dashboard;
