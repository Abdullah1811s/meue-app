import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import DashboardDetailCard from "../components/customComponents/DashboardDetailCard ";
import toast from "react-hot-toast";
import { Clipboard, ClipboardCheck } from "lucide-react"; // Import icons

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
}

interface Referral {
    user: User;
    referralCode?: string;
}

// interface ReferralDetailsResponse {
//     referrer?: User;
// }

// interface UserCodeResponse {
//     referralCode?: string;
// }

// interface ReferralsResponse {
//     referrals: Referral[];
// }

// interface UserResponse {
//     user: User;
// }

// interface ApiResponse<T> {
//     data: T;
// }

const AffiliatedDashboard = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { id } = useParams();
    // const navigate = useNavigate();
    const BASE_SIGNUP_URL = import.meta.env.VITE_BASE_SIGNUP_URL;
    const BASE_SIGNUP_URL_vendor = import.meta.env.VITE_BASE_SIGNUP_URL_VENDOR;
    const [referredBy, setReferredBy] = useState<User | null>(null);
    const [, setUserCode] = useState<string | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [earnings] = useState<{ total: string } | null>(null);
    const [payout] = useState<{ status: string } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userReferralLink, setUserReferralLink] = useState<string>();
    const [vendorReferralLink, setVendorReferralLink] = useState<string>();
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedText(text); // Set copied text to show check icon
        toast.success("Link has been copied");
        setTimeout(() => setCopiedText(null), 2000); // Reset after 2 sec
    };


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!id) {
                    throw new Error("User ID not found");
                }

                // Fetch all API data concurrently
                const [userInfo, referralDetails, userCodeResponse, allReferredUser] = await Promise.all([
                    axios.get(`${API_BASE_URL}/users`),
                    axios.get(`${API_BASE_URL}/referral/${id}/ReferredBy`),
                    axios.get(`${API_BASE_URL}/referral/${id}/Code`),
                    axios.get(`${API_BASE_URL}/referral/${id}/referrals`),
                ].map(p => p.catch(error => ({ data: null, error }))));

                // Update state safely
                setUser(userInfo?.data?.user || null);
                setUserCode(userCodeResponse?.data?.referralCode || null);
                setReferredBy(referralDetails?.data?.referrer || null);
                setUserReferralLink(`${BASE_SIGNUP_URL}?ref=${userCodeResponse.data.referralCode}`);
                setVendorReferralLink(`${BASE_SIGNUP_URL_vendor}?ref=${userCodeResponse.data.referralCode}`);
                setReferrals(allReferredUser?.data?.referrals?.filter((ref: { user: any; }) => ref && ref.user) || []);
                console.log(userCodeResponse.data.referralCode)
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
            <div className="p-6 flex justify-center items-center min-h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

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
                    <h2 className="text-xl font-semibold">Your Details:</h2>
                    <p><strong>Name:</strong> {user.name || "No name provided"}</p>
                    <p><strong>Email:</strong> {user.email || "No email provided"}</p>
                    <p><strong>Phone Number:</strong> {user.phone || "No phone provided"}</p>
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
                    <p><strong>Name:</strong> {referredBy.name || "Not available"}</p>
                    <p><strong>Email:</strong> {referredBy.email || "Not available"}</p>
                </motion.div>
            )}

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <DashboardDetailCard title="Earnings" value={earnings?.total || "0"} />
                <DashboardDetailCard title="Payout Status" value={payout?.status || "Pending"} />

                {/* User Referral Code */}
                <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg">
                    <DashboardDetailCard title="My User Referral Code" value={userReferralLink || "Not available"} />
                    {userReferralLink && (
                        <button
                            onClick={() => copyToClipboard(userReferralLink)}
                            className="flex items-center bg-black text-white px-3 py-1 rounded-lg "
                        >
                            {copiedText === userReferralLink ? (
                                <ClipboardCheck className="w-4 h-4 mr-1" />
                            ) : (
                                <Clipboard className="w-4 h-4 mr-1" />
                            )}
                         
                        </button>
                    )}
                </div>

                {/* Vendor Referral Code */}
                <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg">
                    <DashboardDetailCard title="My Vendor Referral Code" value={vendorReferralLink || "Not available"} />
                    {vendorReferralLink && (
                        <button
                            onClick={() => copyToClipboard(vendorReferralLink)}
                            className="flex items-center bg-black text-white px-3 py-1 rounded-lg "
                        >
                            {copiedText === vendorReferralLink ? (
                                <ClipboardCheck className="w-4 h-4 mr-1" />
                            ) : (
                                <Clipboard className="w-4 h-4 mr-1" />
                            )}
                           
                        </button>
                    )}
                </div>
            </motion.div>

            <motion.div
                className="bg-white p-4 rounded-lg shadow-md mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h2 className="text-lg font-semibold">Referrals</h2>
                {referrals.length > 0 ? (
                    <ul>
                        {referrals.map((ref) => (
                            ref?.user && (
                                <motion.li
                                    key={ref.user._id || Math.random()}
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="p-2 bg-gray-100 rounded-lg mb-2 shadow"
                                >
                                    <p><strong>Name:</strong> {ref.user.name || "No name"}</p>
                                    <p><strong>Email:</strong> {ref.user.email || "No email"}</p>
                                    <p><strong>Referral Code:</strong> {ref.referralCode || "No code"}</p>
                                </motion.li>
                            )
                        ))}
                        <h2>Total users: {referrals.length}</h2>
                    </ul>
                ) : (
                    <p className="text-gray-500">No referrals yet</p>
                )}
            </motion.div>
        </div>
    );
};

export default AffiliatedDashboard;