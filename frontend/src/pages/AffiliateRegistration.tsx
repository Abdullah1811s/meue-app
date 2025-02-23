import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User,  Lock, Globe, CheckCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

// Define Zod Schema
const AffiliateSchema = z
    .object({
        fullname: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .max(15, "Phone number cannot exceed 15 digits")
            .regex(/^\+?[0-9\s-]+$/, "Invalid phone number format"),
        address: z.string().min(5, "Address must be at least 5 characters"),
        marketingChannel: z.string().nonempty("Please select a marketing channel"),
        offering: z.string().min(10, "Please provide at least 10 characters").max(500, "Description cannot exceed 500 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
        agreedToTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

// Infer TypeScript types from Zod schema
type AffiliateFormData = z.infer<typeof AffiliateSchema>;
function AffiliateRegistration() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [isAgreed, setIsAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AffiliateFormData>({
        resolver: zodResolver(AffiliateSchema),
    });

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const onSubmit = async (data: AffiliateFormData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/affiliated/register`, data, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 201) {
                toast.success("Affiliate registration successful! We will notify you in 48-72 hours.");

                await sleep(2000);

                navigate('/');
            } else {
                toast.error(response.data.message || "Something went wrong!");
            }
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error.response?.data?.message || "Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <User className="w-16 h-16 mx-auto mb-4 text-[#C5AD59]" />
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Affiliate Registration</h1>
                    <p className="text-gray-600">Join our affiliate program and earn commissions</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 text-[#C5AD59] border border-[#C5AD59] rounded-md hover:bg-[#C5AD59] hover:text-white transition-all duration-200"
                    >
                        Back
                    </button>
                    <div className="text-gray-600">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input {...register("email")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input {...register("phone")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input {...register("address")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
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
                    {/* Marketing Channel */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <Globe className="w-6 h-6 text-[#C5AD59] mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-800">Marketing Channel</h2>
                        </div>
                        <select {...register("marketingChannel")} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                            <option value="">Select a channel</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Blog">Blog</option>
                            <option value="Email Marketing">Email Marketing</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.marketingChannel && <p className="text-red-500 text-sm mt-1">{errors.marketingChannel.message}</p>}
                    </motion.div>

                    {/* What Are You Offering? */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="w-6 h-6 text-[#C5AD59] mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-800">Tell Us How You’ll Make an Impact!</h2>
                        </div>
                        <textarea
                            {...register("offering", { required: "This field is required" })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            placeholder="Describe what you are offering..."
                        />
                        {errors.offering && <p className="text-red-500 text-sm mt-1">{errors.offering.message}</p>}
                    </motion.div>


                    {/* Agreement */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="w-6 h-6 text-[#C5AD59] mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-800">Agreement</h2>
                        </div>

                        {/* Button to Open Terms */}
                        <button onClick={() => setShowModal(true)} className="text-blue-500 underline">
                            Read Terms & Conditions
                        </button>

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
                                    <p><strong>1. The Menu</strong> (“The Company”), with its principal place of business in South Africa;</p>
                                    <p><strong>2. The Affiliate</strong> (“Affiliate”), whose details are set forth in the signature section of this Agreement.</p>
                                    <p>Collectively referred to as the “Parties.”</p>

                                    <div className="section">
                                        <h2>1. Definitions and Interpretation</h2>
                                        <p><strong>Affiliate:</strong> The individual or entity marketing The Menu’s services.</p>
                                        <p><strong>Commission:</strong> The percentage earned on referred user sign-ups.</p>
                                        <p><strong>Referral:</strong> A user who signs up via the Affiliate’s unique link.</p>
                                        <p><strong>Users:</strong> Individuals who register through the Affiliate’s referral efforts.</p>
                                        <p><strong>POPIA:</strong> The Protection of Personal Information Act of South Africa.</p>
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
                                        <h2>10. Indemnity and Limitation of Liability</h2>
                                        <p>The Affiliate indemnifies The Company against all claims, losses, and damages arising from marketing activities.</p>
                                    </div>

                                    <div className="section">
                                        <h2>11. Miscellaneous Provisions</h2>
                                        <p>This Agreement constitutes the entire understanding between the Parties.</p>
                                    </div>

                                    <div className="section">
                                        <h2>12. Reporting Structure</h2>
                                        <p>The Affiliate will report directly to the Chief Marketing Officer (CMO).</p>
                                    </div>

                                    <div className="section signature">
                                        <h2>13. Signatures</h2>
                                        <p><strong>Affiliate:</strong></p>
                                        <p>Name: ____________________________________________</p>
                                        <p>Identity No: _______________________________________</p>
                                        <p>Address: __________________________________________</p>
                                        <p>Signature: ____________________________</p>
                                        <p>Date: _________________________________</p>

                                        <p><strong>The Menu:</strong></p>
                                        <p>Chief Marketing Officer (CMO): Robbie Kruse</p>
                                        <p>Email: robbie@themenuportal.co.za</p>
                                        <p>Signature: ____________________________</p>
                                        <p>Date: _________________________________</p>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button onClick={() => setShowModal(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                                    Close
                                </button>
                            </motion.div>
                        </motion.div>
                    )}



                    {/* Submit Button */}
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} type="submit" className="w-full bg-[#C5AD59] text-white py-3 px-6 rounded-md hover:bg-[#b39a4d] transition-colors duration-200">
                        Submit Registration
                    </motion.button>
                </form>
            </div>
        </div>
    );
}

export default AffiliateRegistration;