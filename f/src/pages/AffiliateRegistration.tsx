import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Lock, CheckCircle, Eye, EyeOff, Briefcase, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

// Define Zod Schema
const AffiliateSchema = z
    .object({
        fullname: z.string().min(2, "Name must be at least 2 characters"),
        surname: z.string().min(2, "Surname must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z
            .string()
            .min(1, "Phone number must be at least 10 digits")
            .max(15, "Phone number cannot exceed 15 digits")
            .regex(/^\+?[0-9\s-]+$/, "Invalid phone number format"),
        affiliateType: z.enum(["individual", "business"], {
            required_error: "Please select whether you are an individual or a business.",
        }),
        businessName: z.string().optional(),
        companyRegistrationNumber: z.string().optional(),
        vatNumber: z.string().optional(),
        tradingAddress: z.string().optional(),
        countryCode: z.string(),
        idNumber: z
            .string()
            .optional(),

        bankName: z.string().min(2, "Bank name must be at least 2 characters"),
        accountHolder: z.string().min(2, "Account holder name must be at least 2 characters"),
        accountNumber: z.string()
            .min(5, "Account number must be at least 5 digits")
            .max(20, "Account number cannot exceed 20 digits")
            .regex(/^[0-9]+$/, "Account number must contain only numbers"),
        branchCode: z.string()
            .min(4, "Branch code must be at least 4 digits")
            .max(10, "Branch code cannot exceed 10 digits")
            .regex(/^[0-9]+$/, "Branch code must contain only numbers"),
        province: z.string().optional(),
        city: z.string().optional(),
        businessContactNumber: z.string().optional(),
        businessEmail: z.string().optional(),
        promotionChannels: z.array(z.string()).nonempty("Please select at least one promotion channel"),
        targetAudience: z.string().min(10, "Please provide at least 10 characters").max(500, "Description cannot exceed 500 characters"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
        agreedToTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
        confirmationLetter: z.any().optional()
            .refine((fileList) => {
                // If no file is uploaded, it's valid (optional)
                if (!fileList || fileList.length === 0) return true;

                const file = fileList[0];
                const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
                const maxSize = 20 * 1024 * 1024; // 20MB

                // Check file type
                if (!allowedTypes.includes(file.type)) {
                    return false;
                }

                // Check file size
                if (file.size > maxSize) {
                    return false;
                }

                return true;
            }, {
                message: "File must be a PDF, PNG, JPG, or JPEG and under 20MB"
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    })
    .refine(
        (data) => {
            if (data.affiliateType === "business") {
                return data.businessName && data.tradingAddress && data.province && data.city && data.businessContactNumber;
            }
            return true;
        },
        {
            message: "Business details are required for business affiliates.",
            path: ["businessName"],
        }
    );

// Infer TypeScript types from Zod schema
type AffiliateFormData = z.infer<typeof AffiliateSchema>;

const provinces = [
    { name: "Eastern Cape", cities: ["Gqeberha (Port Elizabeth)", "East London", "Mthatha", "Queenstown", "Grahamstown", "King William’s Town"] },
    { name: "Free State", cities: ["Bloemfontein", "Welkom", "Bethlehem", "Sasolburg", "Parys", "Kroonstad"] },
    { name: "Gauteng", cities: ["Johannesburg", "Pretoria", "Sandton", "Midrand", "Centurion", "Soweto", "Benoni", "Boksburg", "Kempton Park", "Alberton", "Vanderbijlpark"] },
    { name: "KwaZulu-Natal", cities: ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Pinetown", "Umhlanga", "Ballito", "Margate"] },
    { name: "Limpopo", cities: ["Polokwane", "Tzaneen", "Mokopane", "Thohoyandou", "Bela-Bela", "Lephalale"] },
    { name: "Mpumalanga", cities: ["Mbombela (Nelspruit)", "Witbank (eMalahleni)", "Middelburg", "Secunda", "Barberton", "Sabie"] },
    { name: "Northern Cape", cities: ["Kimberley", "Upington", "Springbok", "De Aar", "Kuruman", "Colesberg"] },
    { name: "North West", cities: ["Mahikeng", "Rustenburg", "Klerksdorp", "Potchefstroom", "Brits", "Lichtenburg"] },
    { name: "Western Cape", cities: ["Cape Town", "Stellenbosch", "George", "Paarl", "Worcester", "Mossel Bay", "Knysna"] },
];


function AffiliateRegistration() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [isAgreed, setIsAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [confirmationLetterPreview, setConfirmationLetterPreview] = useState<File | null>(null);
    const isUser = useSelector((state: any) => state.auth.isUserAuthenticated);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AffiliateFormData>({
        resolver: zodResolver(AffiliateSchema),
    });

    const affiliateType = watch("affiliateType");

    // Update cities based on selected province
    const handleProvinceChange = (provinceName: string) => {
        const province = provinces.find((p) => p.name === provinceName);
        if (province) {
            setCities(province.cities);
        } else {
            setCities([]);
        }
    };

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const getSignature = async (folder: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/generateSignature`, { folder });

            return response.data;
        } catch (error) {
            console.error("Error in getting signature for ", folder);
            throw error; // Re-throw to handle in calling function
        }
    };

    const makeCloudinaryApiCall = async (data: FormData) => {
        try {
            const cloudName = import.meta.env.VITE_CLOUD_NAME;
            const api = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

            const res = await axios.post(api, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { secure_url, public_id } = res.data;


            return { secure_url, public_id };
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            throw error; // Re-throw to handle in calling function
        }
    };

    const uploadAffiliateBankConfirmation = async (timestamp: number, signature: string) => {
        if (!confirmationLetterPreview) {
            console.error("No bank confirmation letter file selected");
            return null;
        }

        const data = new FormData();
        data.append("file", confirmationLetterPreview);
        data.append("timestamp", timestamp.toString());
        data.append("signature", signature);
        data.append("api_key", import.meta.env.VITE_CLOUD_API);
        data.append("folder", "BankConfirmationAffiliate");



        try {
            const result = await makeCloudinaryApiCall(data);

            return result; // Return just the URL
        } catch (error) {
            console.error("Bank Confirmation Upload Failed:", error);
            throw error;
        }
    };

    const onSubmit = async (data: AffiliateFormData) => {
        try {
            setLoading(true);
            const userExists = await axios.post(`${API_BASE_URL}/affiliated/checkEmail`, {
                email: data.email
            }, {
                headers: { "Content-Type": "application/json" },
            })

            if (userExists?.data?.data?.exists) {
                toast.error("Email already register")
                return;
            }
            // Ensure password and confirmPassword match
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords do not match.");
                return;
            }

            let bankConfirmationUrl = null;
            if (data.confirmationLetter && data.confirmationLetter.length > 0) {
                try {
                    const { timestamp, signature } = await getSignature("BankConfirmationAffiliate");
                    bankConfirmationUrl = await uploadAffiliateBankConfirmation(timestamp, signature);
                } catch (error) {
                    console.error("Error uploading bank confirmation:", error);
                    toast.error("Failed to upload bank confirmation. Please try again.");
                    return;
                }
            }

            // Prepare data to match schema
            const payload: Record<string, any> = {
                fullName: data.fullname,
                surname: data.surname,
                email: data.email,
                phoneNumber: data.phone,
                type: data.affiliateType,
                businessName: data.businessName || null,
                companyRegistrationNumber: data.companyRegistrationNumber || null,
                vatNumber: data.vatNumber || null,
                tradingAddress: data.tradingAddress || null,
                provinceCity: `${data.province || ""} ${data.city || ""}`.trim() || null,
                businessContactNumber: data.businessContactNumber || null,
                businessEmailAddress: data.businessEmail || null,
                password: data.password,
                promotionChannels: data.promotionChannels || [],
                targetAudience: data.targetAudience || null,
                bankName: data.bankName,
                accountHolder: data.accountHolder,
                accountNumber: data.accountNumber,
                branchCode: data.branchCode,
                idNumber: data.idNumber,
                bankConfirmationUrl: bankConfirmationUrl
            };


            const response = await axios.post(`${API_BASE_URL}/affiliated/register`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                toast.success("Affiliate registration successful! We will notify you in 48-72 hours.");
                await sleep(2000);
                navigate("/");
            } else {
                toast.error(response.data.message || "Something went wrong!");
            }
        } catch (error: any) {
            console.error("Error submitting form:", error);
            const errorMessage = error.response?.data?.message || "Server error. Please try again later.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {
                isUser ?
                    (
                        <motion.div
                            className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }
                            }
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="max-w-md w-full bg-gray-50 rounded-xl p-6 text-center border border-gray-100 shadow-md"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <motion.h2
                                    className="text-2xl font-bold text-[#DBC166] mb-4"
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    You're Already Logged In
                                </motion.h2>

                                <motion.p
                                    className="text-gray-600 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                >
                                    You are currently logged in as a user. Please log out first if you want to access a different account.
                                </motion.p>

                                <motion.button
                                    onClick={() => navigate(-1)}
                                    className="w-full bg-white border border-[#DBC166] text-[#DBC166] py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.8 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Go Back
                                </motion.button>
                            </motion.div>
                        </motion.div >
                    )
                    : (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="max-w-4xl mx-auto px-4 py-12">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                                <User className="w-16 h-16 mx-auto mb-4 text-[#C5AD59]" />
                                <h1 className="text-4xl font-bold text-gray-800 mb-2">Affiliate Registration</h1>
                                <p className="text-gray-600">Join our affiliate program and earn commissions</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mb-4 flex justify-between items-center"
                            >
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 text-[#C5AD59] border border-[#C5AD59] rounded-md hover:bg-[#C5AD59] hover:text-white transition-all duration-200"
                                >
                                    Back
                                </button>
                                <div className="text-gray-600 ml-3 md:ml-0">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => navigate("/affiliated/login")}
                                        className="text-[#C5AD59] font-semibold hover:underline"
                                    >
                                        Login here
                                    </button>
                                </div>
                            </motion.div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                {/* Personal Information */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <User className="w-6 h-6 text-[#C5AD59] mr-2" />
                                        <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input {...register("fullname")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                                            <input {...register("surname")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                            {errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input {...register("email")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    {...register("countryCode")}
                                                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                                                >
                                                    <option value="+27">🇿🇦 (+27)</option>
                                                    <option value="+971">🇦🇪 (+971)</option>
                                                    <option value="+7">🇷🇺 (+7)</option>
                                                    <option value="+20">🇪🇬 (+20)</option>
                                                    <option value="+234">🇳🇬 (+234)</option>
                                                    <option value="+255">🇹🇿 (+255)</option>
                                                    <option value="+256">🇺🇬 (+256)</option>
                                                    <option value="+1">🇺🇸 (+1)</option>
                                                    <option value="+44">🇬🇧 (+44)</option>
                                                    <option value="+91">🇮🇳 (+91)</option>
                                                    <option value="+61">🇦🇺 (+61)</option>
                                                    <option value="+49">🇩🇪 (+49)</option>
                                                    <option value="+33">🇫🇷 (+33)</option>
                                                    <option value="+81">🇯🇵 (+81)</option>
                                                    <option value="+55">🇧🇷 (+55)</option>
                                                </select>

                                                <input
                                                    {...register("phone", {
                                                        pattern: {
                                                            value: /^\+?[0-9]+$/,
                                                            message: "Please enter a valid phone number (only digits and optional + at start)"
                                                        }
                                                    })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                    placeholder="Enter phone number"
                                                    onKeyDown={(e) => {
                                                        if ([8, 9, 13, 27, 46].includes(e.keyCode) ||
                                                            (e.keyCode === 65 && e.ctrlKey) ||
                                                            (e.keyCode === 67 && e.ctrlKey) ||
                                                            (e.keyCode === 86 && e.ctrlKey) ||
                                                            (e.keyCode === 88 && e.ctrlKey) ||
                                                            (e.keyCode >= 35 && e.keyCode <= 39)) {
                                                            return;
                                                        }

                                                        if (e.key === '+' && e.currentTarget.selectionStart === 0 && !e.currentTarget.value.includes('+')) {
                                                            return;
                                                        }

                                                        if ((e.key < '0' || e.key > '9') && e.key !== '+') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Business or Individual Status */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <Briefcase className="w-6 h-6 text-[#C5AD59] mr-2" />
                                        <h2 className="text-2xl font-semibold text-gray-800">Business or Individual Status</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Are you signing up as an individual or a business?</label>
                                            <select {...register("affiliateType")} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                                <option value="">Select an option</option>
                                                <option value="individual">Individual Affiliate</option>
                                                <option value="business">Business Affiliate</option>
                                            </select>
                                            {errors.affiliateType && <p className="text-red-500 text-sm mt-1">{errors.affiliateType.message}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                                {affiliateType === "individual" && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex items-center mb-4">
                                            <User className="w-6 h-6 text-[#C5AD59] mr-2" />
                                            <h2 className="text-2xl font-semibold text-gray-800">Individual Details</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                                                <input
                                                    {...register("idNumber")

                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                    placeholder="Enter your 13-digit ID number"
                                                />
                                                {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber.message}</p>}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {/* Business Details (Conditional Rendering) */}
                                {affiliateType === "business" && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex items-center mb-4">
                                            <Briefcase className="w-6 h-6 text-[#C5AD59] mr-2" />
                                            <h2 className="text-2xl font-semibold text-gray-800">Business Details</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                                <input {...register("businessName")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Registration Number</label>
                                                <input {...register("companyRegistrationNumber")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                                {errors.companyRegistrationNumber && <p className="text-red-500 text-sm mt-1">{errors.companyRegistrationNumber.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                                                <input {...register("vatNumber")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                                {errors.vatNumber && <p className="text-red-500 text-sm mt-1">{errors.vatNumber.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Trading Address</label>
                                                <input {...register("tradingAddress")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                                {errors.tradingAddress && <p className="text-red-500 text-sm mt-1">{errors.tradingAddress.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                                <select
                                                    {...register("province")}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                                >
                                                    <option value="">Select a province</option>
                                                    {provinces.map((province) => (
                                                        <option key={province.name} value={province.name}>
                                                            {province.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <select {...register("city")} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                                    <option value="">Select a city</option>
                                                    {cities.map((city) => (
                                                        <option key={city} value={city}>
                                                            {city}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Contact Number</label>
                                                <input {...register("businessContactNumber")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                                {errors.businessContactNumber && <p className="text-red-500 text-sm mt-1">{errors.businessContactNumber.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Email Address</label>
                                                <input
                                                    {...register("businessEmail")}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                />

                                                {errors.businessEmail && <p className="text-red-500 text-sm mt-1">{errors.businessEmail.message}</p>}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Promotion Preferences */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <Share2 className="w-6 h-6 text-[#C5AD59] mr-2" />
                                        <h2 className="text-2xl font-semibold text-gray-800">Promotion Preferences</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Channels</label>
                                            <select {...register("promotionChannels")} multiple className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                                <option value="Social Media">Social Media</option>
                                                <option value="Email Marketing">Email Marketing</option>
                                                <option value="Influencer Partnerships">Influencer Partnerships</option>
                                                <option value="Offline Events">Offline Events</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.promotionChannels && <p className="text-red-500 text-sm mt-1">{errors.promotionChannels.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                            <textarea
                                                {...register("targetAudience")}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                placeholder="Describe your target audience..."
                                            />
                                            {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>}
                                        </div>
                                    </div>
                                </motion.div>


                                {/* bank detail fields */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#C5AD59] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                        <h2 className="text-2xl font-semibold text-gray-800">Banking Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name of Bank</label>
                                            <input
                                                {...register("bankName")}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                placeholder="e.g., ABSA, FNB, Standard Bank"
                                            />
                                            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                                            <input
                                                {...register("accountHolder")}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                placeholder="Name as it appears on bank account"
                                            />
                                            {errors.accountHolder && <p className="text-red-500 text-sm mt-1">{errors.accountHolder.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                            <input
                                                {...register("accountNumber")}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                placeholder="Enter account number"
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                                            <input
                                                {...register("branchCode")}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                                placeholder="Enter branch code"
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors.branchCode && <p className="text-red-500 text-sm mt-1">{errors.branchCode.message}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Confirmation Letter (Optional)</label>
                                            <div className="relative flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
                                                <input
                                                    type="file"
                                                    id="confirmationLetter"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    {...register("confirmationLetter")}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        setConfirmationLetterPreview(file || null);
                                                    }}
                                                />
                                                <span className="text-gray-600">Click to upload or drag & drop</span>
                                            </div>

                                            {/* File preview */}
                                            {confirmationLetterPreview && (
                                                <div className="mt-3 flex items-center space-x-3">
                                                    <span className="text-gray-700">{confirmationLetterPreview.name}</span>
                                                    <a
                                                        href={URL.createObjectURL(confirmationLetterPreview)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 text-sm hover:underline"
                                                    >
                                                        View
                                                    </a>
                                                    <button
                                                        type="button"
                                                        className="text-red-500 text-sm hover:underline"
                                                        onClick={() => {
                                                            setConfirmationLetterPreview(null);
                                                            // Clear the file input
                                                            const fileInput = document.getElementById('confirmationLetter') as HTMLInputElement;
                                                            if (fileInput) fileInput.value = '';
                                                            // Clear from form state
                                                            setValue("confirmationLetter", null);
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>


                                {/* Password Section */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <Lock className="w-6 h-6 text-[#C5AD59] mr-2" />
                                        <h2 className="text-2xl font-semibold text-gray-800">Set Password</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    {...register("password")}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    {...register("confirmPassword")}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Agreement */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <CheckCircle className="w-6 h-6 text-[#C5AD59] mr-2" />
                                        <h2 className="text-2xl font-semibold text-gray-800">Agreement</h2>
                                    </div>

                                    {/* Button to Open Terms */}
                                    <button onClick={() => setShowModal(true)} className="text-[#C5AD59] underline">
                                        Read Terms & Conditions
                                    </button>
                                    <br />
                                    <a href="/docs/Affiliate_Contract_pdf.pdf" download="Affiliate_Contract_pdf.pdf" className="text-blue-500 underline">
                                        Download
                                    </a>
                                    {/* Checkbox */}
                                    <label className="flex items-center mt-2">
                                        <input type="checkbox" {...register("agreedToTerms")} className="mr-2" onChange={() => setIsAgreed(!isAgreed)} />
                                        <span className="text-gray-700">I agree to the affiliate terms and conditions</span>
                                    </label>
                                    {errors.agreedToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms.message}</p>}
                                </motion.div>

                                {/* Modal */}
                                {showModal && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
                                            <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>

                                            {/* Scrollable Text Container */}
                                            <div className="max-h-80 overflow-y-auto p-4 border border-gray-300 rounded-md text-sm leading-relaxed space-y-4">
                                                <h1>Affiliate Marketing Agreement</h1>
                                                <p>This Affiliate Marketing Agreement (“Agreement”) is entered into by and between:</p>
                                                <p>
                                                    <strong>1. The Menu</strong> (“The Company”), with its principal place of business in South Africa;
                                                </p>
                                                <p>
                                                    <strong>2. The Affiliate</strong> (“Affiliate”), whose details are set forth in the signature section of this Agreement.
                                                </p>
                                                <p>Collectively referred to as the “Parties.”</p>

                                                <div className="section">
                                                    <h2>1. Definitions and Interpretation</h2>
                                                    <p>
                                                        <strong>Affiliate:</strong> The individual or entity marketing The Menu’s services.
                                                    </p>
                                                    <p>
                                                        <strong>Commission:</strong> The percentage earned on referred user sign-ups.
                                                    </p>
                                                    <p>
                                                        <strong>Referral:</strong> A user who signs up via the Affiliate’s unique link.
                                                    </p>
                                                    <p>
                                                        <strong>Users:</strong> Individuals who register through the Affiliate’s referral efforts.
                                                    </p>
                                                    <p>
                                                        <strong>POPIA:</strong> The Protection of Personal Information Act of South Africa.
                                                    </p>
                                                </div>

                                                <div className="section">
                                                    <h2>2. Appointment and Scope of Engagement</h2>
                                                    <p>The Company appoints the Affiliate as a non-exclusive marketing partner.</p>
                                                    <p>The Affiliate agrees to promote The Menu and generate user sign-ups.</p>
                                                    <p>All Marketing Affiliates will report directly to the Chief Marketing Officer (CMO).</p>
                                                    <p>The Affiliate operates as an independent contractor and is not an employee or agent of The Company.</p>
                                                </div>

                                                <div className="section">
                                                    <h2>3. Commission Structure and Payment Terms</h2>
                                                    <ul>
                                                        <li>Year 1: 30% commission on payments received from members or one-time pass users.</li>
                                                        <li>Year 2: 15% commission on payments received from members or one-time pass users.</li>
                                                        <li>After Year 2: No further commission will be payable.</li>
                                                    </ul>
                                                    <p>VAT Inclusion: The above commissions are inclusive of VAT where applicable.</p>
                                                    <p>Payment Schedule: Commissions are paid monthly, within 15 business days after month-end.</p>
                                                </div>

                                                <div className="section">
                                                    <h2>4. Affiliate Obligations and Restrictions</h2>
                                                    <p>The Affiliate agrees to:</p>
                                                    <ul>
                                                        <li>Use only marketing materials provided or approved by The Company.</li>
                                                        <li>Ensure all marketing efforts comply with The Company’s brand guidelines.</li>
                                                        <li>Avoid false, misleading, or spammy advertising practices.</li>
                                                        <li>Comply with South Africa’s POPIA when collecting or using personal information.</li>
                                                    </ul>
                                                </div>

                                                <div className="section">
                                                    <h2>5. The Menu’s Obligations</h2>
                                                    <p>The Company agrees to:</p>
                                                    <ul>
                                                        <li>Provide access to the affiliate dashboard and unique referral links.</li>
                                                        <li>Supply marketing materials and promotional assets.</li>
                                                        <li>Pay commissions on time according to the agreed terms.</li>
                                                    </ul>
                                                </div>

                                                <div className="section">
                                                    <h2>6. Intellectual Property Rights</h2>
                                                    <p>The Company grants the Affiliate a non-exclusive, non-transferable license to use its trademarks and promotional materials.</p>
                                                    <p>The Affiliate may not alter The Company’s branding without written consent.</p>
                                                </div>

                                                <div className="section">
                                                    <h2>7. Confidentiality and Data Protection</h2>
                                                    <p>The Affiliate agrees to maintain the confidentiality of all non-public information shared by The Company.</p>
                                                    <p>The Affiliate shall comply with the POPIA in collecting and processing personal information.</p>
                                                </div>

                                                <div className="section">
                                                    <h2>8. Duration and Termination</h2>
                                                    <p>Term: This Agreement is effective from the date signed and continues for 12 months, with automatic renewal unless terminated.</p>
                                                    <p>Termination by Notice: Either party may terminate with 30 days’ written notice.</p>
                                                </div>

                                                <div className="section">
                                                    <h2>9. Dispute Resolution and Governing Law</h2>
                                                    <p>This Agreement is governed by the laws of the Republic of South Africa.</p>
                                                    <p>Disputes will be resolved through mediation, and if unsuccessful, arbitration.</p>
                                                </div>
                                                <div className="section">
                                                    <h2>10. Miscellaneous</h2>
                                                    <p>Entire Agreement: This Agreement constitutes the entire understanding between the Parties.</p>
                                                    <p>Amendments: Any changes must be in writing and signed by both Parties.</p>
                                                    <p>Severability: If any provision is found invalid, the remainder of the Agreement remains in effect.</p>
                                                </div>
                                            </div>

                                            {/* Close Button */}
                                            <div className="mt-6 text-right">
                                                <button
                                                    onClick={() => setShowModal(false)}
                                                    className="px-4 py-2 bg-[#C5AD59] text-white rounded-md hover:bg-[#B89C4A] transition-all duration-200"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                                    <button
                                        type="submit"
                                        disabled={!isAgreed || loading}
                                        className={`px-8 py-3 text-white rounded-md transition-all duration-200 flex items-center justify-center ${!isAgreed || loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#C5AD59] hover:bg-[#B89C4A]"
                                            }`}
                                    >
                                        {loading ? (
                                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                                        ) : (
                                            "Register"
                                        )}
                                    </button>

                                </motion.div>
                            </form>
                        </div>
                    </div>)
            }
        </>
    );

}

export default AffiliateRegistration;