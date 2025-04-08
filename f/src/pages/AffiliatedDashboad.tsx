import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Clipboard, ClipboardCheck, User, Users, Gift, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Referral {
    user: {
        _id: string;
        name: string;
        email: string;
    };
    referralCode?: string;
}

export interface IAffiliate {
    _id: string;
    fullName: string;
    surname: string;
    email: string;
    phoneNumber: string;
    type: "individual" | "business";
    businessName?: string | null;
    companyRegistrationNumber?: string | null;
    vatNumber?: string | null;
    tradingAddress?: string | null;
    provinceCity?: string | null;
    businessContactNumber?: string | null;
    businessEmailAddress?: string | null;
    status: "pending" | "approved" | "rejected";
    promotionChannels?: Array<"Social Media" | "Email Marketing" | "Influencer Partnerships" | "Offline Events" | "Other">;
    socialMediaPlatforms?: string[];
    otherPromotionMethod?: string | null;
    targetAudience?: string | null;
    referralCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const AffiliatedDashboard = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { id } = useParams();
    const BASE_SIGNUP_URL = import.meta.env.VITE_BASE_SIGNUP_URL;
    const BASE_SIGNUP_URL_vendor = import.meta.env.VITE_BASE_SIGNUP_URL_VENDOR;
    const [count , setCount] = useState();
    const [affiliate, setAffiliate] = useState<IAffiliate | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    // const [earnings] = useState<{ total: string }>({ total: "0.00" });
    // const [payout] = useState<{ status: string }>({ status: "Pending" });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userReferralLink, setUserReferralLink] = useState<string>("");
    const [vendorReferralLink, setVendorReferralLink] = useState<string>("");
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copyToClipboard = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast.success(`${type} link copied!`);
        setTimeout(() => setCopiedText(null), 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!id) throw new Error("Affiliate ID not found");

                const [affiliateData, referralCodeResponse, allReferredUser] = await Promise.all([
                    axios.get(`${API_BASE_URL}/affiliated/get/${id}`),
                    axios.get(`${API_BASE_URL}/referral/${id}/Code`),
                    axios.get(`${API_BASE_URL}/referral/${id}/referrals`),
                ].map(p => p.catch(error => ({ data: null, error }))));

                setAffiliate(affiliateData?.data.data.affiliate || null);
                setCount(affiliateData?.data.data.refCount || 0);
                setUserReferralLink(`${BASE_SIGNUP_URL}?ref=${referralCodeResponse.data.referralCode}`);
                setVendorReferralLink(`${BASE_SIGNUP_URL_vendor}?ref=${referralCodeResponse.data.referralCode}`);
                setReferrals(allReferredUser?.data?.referrals?.filter((ref: { user: any; }) => ref && ref.user) || []);
                
            } catch (error: any) {
                console.error("Error fetching data", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
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

    function handleLogout() {
        localStorage.removeItem("affiliatedToken");
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Header */}
            <div className="flex justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800">Affiliate Dashboard</h1>
                    <p className="text-gray-600">
                        {affiliate?.type === "business"
                            ? `${affiliate.businessName}'s Performance`
                            : `${affiliate?.fullName}'s Performance`}
                    </p>

                </motion.div>
                <Button
                    className="m-2 bg-[#DBC166] text-black font-bold px-4 py-2 rounded-md shadow-md transition-all duration-300 ease-in-out hover:bg-[#C0A94B] hover:scale-95 active:scale-90"
                    onClick={handleLogout}
                >
                    Log out
                </Button>

            </div>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Earnings Card */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#DBC166]"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                            <p className="text-2xl font-bold mt-1">${earnings.total}</p>
                        </div>
                        <div className="p-3 rounded-full bg-[#DBC166]/10">
                            <DollarSign className="text-[#DBC166]" size={20} />
                        </div>
                    </div>
                </motion.div>

                {/* Payout Status Card */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Payout Status</p>
                            <p className="text-2xl font-bold mt-1 capitalize">{payout.status}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <CreditCard className="text-blue-500" size={20} />
                        </div>
                    </div>
                </motion.div> */}

                {/* Referrals Count Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                            <p className="text-2xl font-bold mt-1">{count}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <Users className="text-green-500" size={20} />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Affiliate Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Personal Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-6 rounded-xl shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-[#DBC166] flex items-center justify-center text-white font-bold">
                            {affiliate?.fullName?.charAt(0) || "A"}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Affiliate Details</h2>
                            <p className="text-sm text-gray-500">
                                {affiliate?.type === "business" ? "Business information" : "Personal information"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Full Name</span>
                            <span className="font-medium">{affiliate?.fullName || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium">{affiliate?.email || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-medium">{affiliate?.phoneNumber || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Status</span>
                            <span className={`font-medium capitalize ${affiliate?.status === "approved" ? "text-green-500" :
                                affiliate?.status === "rejected" ? "text-red-500" : "text-yellow-500"
                                }`}>
                                {affiliate?.status || "pending"}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Business Info (if business type) */}
                {affiliate?.type === "business" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-6 rounded-xl shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Business Details</h2>
                                <p className="text-sm text-gray-500">Company information</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {affiliate.businessName && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Business Name</span>
                                    <span className="font-medium">{affiliate.businessName}</span>
                                </div>
                            )}
                            {affiliate.companyRegistrationNumber && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Registration #</span>
                                    <span className="font-medium">{affiliate.companyRegistrationNumber}</span>
                                </div>
                            )}
                            {affiliate.tradingAddress && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Address</span>
                                    <span className="font-medium">{affiliate.tradingAddress}</span>
                                </div>
                            )}
                            {affiliate.businessContactNumber && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Contact Number</span>
                                    <span className="font-medium">{affiliate.businessContactNumber}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Promotion Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-800">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Promotion Methods</h2>
                            <p className="text-sm text-gray-500">Your marketing channels</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {affiliate?.promotionChannels?.length ? (
                            <div className="py-2 border-b border-gray-100">
                                <span className="text-gray-500">Primary Channels</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {affiliate.promotionChannels.map(channel => (
                                        <span key={channel} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                            {channel}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                        {affiliate?.socialMediaPlatforms?.length ? (
                            <div className="py-2 border-b border-gray-100">
                                <span className="text-gray-500">Social Media</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {affiliate.socialMediaPlatforms.map(platform => (
                                        <span key={platform} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                        {affiliate?.targetAudience && (
                            <div className="py-2">
                                <span className="text-gray-500">Target Audience</span>
                                <p className="font-medium mt-1">{affiliate.targetAudience}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Referral Links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h2 className="text-xl font-semibold mb-4">Your Referral Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Referral Link */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-full bg-blue-100">
                                <User className="text-blue-600" size={18} />
                            </div>
                            <h3 className="font-medium">User Referral Link</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 truncate text-sm border border-gray-200 rounded-md p-2 bg-gray-50">
                                {userReferralLink || "Not available"}
                            </div>
                            <button
                                onClick={() => copyToClipboard(userReferralLink, "User")}
                                className="p-2 text-white rounded-md  transition bg-[#DBC166]"
                            >
                                {copiedText === userReferralLink ? (
                                    <ClipboardCheck size={18} className="bg-[#DBC166]" />
                                ) : (
                                    <Clipboard size={18} className="bg-[#DBC166]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Vendor Referral Link */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-full bg-purple-100">
                                <Users className="text-purple-600" size={18} />
                            </div>
                            <h3 className="font-medium">Vendor Referral Link</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 truncate text-sm border border-gray-200 rounded-md p-2 bg-gray-50">
                                {vendorReferralLink || "Not available"}
                            </div>
                            <button
                                onClick={() => copyToClipboard(vendorReferralLink, "Vendor")}
                                className="p-2  text-white rounded-md  transition bg-[#DBC166]"
                            >
                                {copiedText === vendorReferralLink ? (
                                    <ClipboardCheck size={18} className="bg-[#DBC166]" />
                                ) : (
                                    <Clipboard size={18} className="bg-[#DBC166]" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Referrals List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Gift className="text-[#DBC166]" size={20} />
                        Your Referrals ({referrals.length})
                    </h2>
                </div>

                {referrals.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {referrals.map((ref) => (
                            ref?.user && (
                                <motion.div
                                    key={ref.user._id || Math.random()}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                {ref.user.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium">{ref.user.name}</p>
                                                <p className="text-sm text-gray-500">{ref.user.email}</p>
                                            </div>
                                        </div>
                                        {ref.referralCode && (
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                                                {ref.referralCode}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Users className="text-gray-400" size={24} />
                        </div>
                        <h3 className="font-medium text-gray-700">No referrals yet</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Share your referral links to start earning commissions
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AffiliatedDashboard;