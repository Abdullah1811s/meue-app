import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Copy, Home, LogOut, User, Users, Gift, Award } from "lucide-react";
import toast from "react-hot-toast";

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    province?: string;
    town?: string;
    street?: string;
    prizeWon?: string[];
    postalCode?: string;
    referralCodeShare?: string;
}

interface Referral {
    user: User;
    referralCode?: string;
}

const UserDash = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const BASE_SIGNUP_URL = import.meta.env.VITE_BASE_SIGNUP_URL;
    const BASE_SIGNUP_URL_vendor = import.meta.env.VITE_BASE_SIGNUP_URL_VENDOR;
    const { id } = useParams();
    const navigate = useNavigate();
    const [referredBy, setReferredBy] = useState<User | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [myInfo, setMyInfo] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userReferralLink, setUserReferralLink] = useState<string>("");
    const [vendorReferralLink, setVendorReferralLink] = useState<string>("");

    const handleHome = () => navigate(`/users/${id}`);
    const handleLogout = () => {
        localStorage.removeItem("UserToken");
        localStorage.removeItem("id");
        navigate('/');
        window.location.reload();
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!id) throw new Error("User ID not found");

                const [myInfo, referralDetails, allReferredUser] = await Promise.all([
                    // axios.get(`${API_BASE_URL}/users`),
                    axios.get(`${API_BASE_URL}/users/${id}`),
                    axios.get(`${API_BASE_URL}/referral/${id}/ReferredBy`),
                    axios.get(`${API_BASE_URL}/referral/${id}/referrals`),
                ].map(p => p.catch(error => ({ data: null, error }))));

                setMyInfo(myInfo.data.user);
                console.log(myInfo.data.user);
                setUserReferralLink(`${BASE_SIGNUP_URL}?ref=${myInfo.data.user.referralCodeShare}`);
                setVendorReferralLink(`${BASE_SIGNUP_URL_vendor}?ref=${myInfo.data.user.referralCodeShare}`);
                setReferredBy(referralDetails?.data?.referrer || null);
                setReferrals(allReferredUser?.data?.referrals?.filter((ref: { user: any; }) => ref && ref.user) || []);

                if (referrals.length >= 10) {
                    await axios.put(`${API_BASE_URL}/users/${id}/increasePoint`);
                }
            } catch (error: any) {
                console.error("Error fetching data", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const copyToClipboard = (linkType: string) => {
        const link = linkType === "user" ? userReferralLink : vendorReferralLink;
        if (link) {
            navigator.clipboard.writeText(link)
                .then(() => toast.success(`${linkType === "user" ? "User" : "Vendor"} link copied!`))
                .catch(() => toast.error("Failed to copy link"));
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DBC166]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-[#DBC166] text-white py-2 rounded-md hover:bg-[#C0AC50] transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <motion.h1
                    className="text-3xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    My Dashboard
                </motion.h1>

                <div className="flex gap-2">
                    <button
                        onClick={handleHome}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                    >
                        <Home size={18} /> Home
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-16 w-16 rounded-full bg-[#DBC166] flex items-center justify-center text-white text-2xl font-bold">
                                {myInfo?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{myInfo?.name || "User"}</h2>
                                <p className="text-sm text-gray-500">{myInfo?.email}</p>
                                <span className="inline-block mt-1 px-2 py-1 text-xs border border-[#DBC166] text-[#DBC166] rounded-md">
                                    Member
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium">{myInfo?.phone || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium">
                                    {myInfo?.city || "Unknown"}, {myInfo?.province || ""}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-500">Address</span>
                                <span className="font-medium text-right">
                                    {myInfo?.street || "Not specified"}, {myInfo?.postalCode || ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Referred By Section */}
                    {referredBy && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                                    {referredBy.name?.charAt(0) || "R"}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Referred By</h3>
                                    <p className="text-sm text-gray-500">{referredBy.name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Referral Links Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Referral Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                    <User size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">User Referral</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1 truncate text-sm border border-gray-200 rounded-lg p-2 bg-gray-50">
                                    {userReferralLink || "Not available"}
                                </div>
                                <button
                                    onClick={() => copyToClipboard("user")}
                                    className="p-2 text-[#DBC166] hover:bg-[#DBC166]/10 rounded-md transition"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Share this link with your friends and earn points when they sign up!
                            </p>

                        </div>

                        {/* Vendor Referral Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                                    <Users size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Vendor Referral</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1 truncate text-sm border border-gray-200 rounded-lg p-2 bg-gray-50">
                                    {vendorReferralLink || "Not available"}
                                </div>
                                <button
                                    onClick={() => copyToClipboard("vendor")}
                                    className="p-2 text-[#DBC166] hover:bg-[#DBC166]/10 rounded-md transition"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Share this link with your friends and earn points when they sign up!
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex items-center justify-center gap-3">
                                <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                                    <Award size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Prizes Won</h3>
                            </div>
                            <span className="px-3 py-1 text-sm border border-gray-200 rounded-md">
                                {myInfo?.prizeWon?.length} Total
                            </span>
                        </div>

                        {myInfo?.prizeWon && myInfo.prizeWon.length > 0 ? (
                            <div className="space-y-3">
                                {myInfo.prizeWon.map((prize: any, index: any) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                                <Gift size={16} />
                                            </div>
                                            <span className="font-medium">{prize}</span>
                                        </div>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                            Claimed
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                    <Gift size={20} className="text-gray-400" />
                                </div>
                                <h4 className="font-medium text-gray-700">No prizes yet</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    🎡 Spin the wheel for a chance to win!
                                    🎟️ Or join the raffle to win big!
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Referrals List */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-green-50 text-green-600">
                                    <Gift size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Your Referrals</h3>
                            </div>
                            <span className="px-3 py-1 text-sm border border-gray-200 rounded-md">
                                {referrals.length} Total
                            </span>
                        </div>

                        {referrals.length > 0 ? (
                            <div className="space-y-3">
                                {referrals.map((ref) => (
                                    ref?.user && (
                                        <motion.div
                                            key={ref.user._id || Math.random()}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                {ref.user.name?.charAt(0) || "U"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{ref.user.name}</p>
                                                <p className="text-sm text-gray-500 truncate">{ref.user.email}</p>
                                            </div>
                                            {ref.referralCode && (
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                                                    {ref.referralCode}
                                                </span>
                                            )}
                                        </motion.div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <Users size={24} className="text-gray-400" />
                                </div>
                                <h3 className="font-medium text-gray-700">No referrals yet</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Share your referral links to invite friends
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDash;