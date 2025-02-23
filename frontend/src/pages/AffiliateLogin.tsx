import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function AffiliateLogin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/affiliated/login`, data, {
                headers: { "Content-Type": "application/json" },
            });
            const id = response.data.affiliate._id;
            console.log("The id is ", id);

            if (response.status === 200) {
                const status = response.data.affiliate.status;

                if (status === "Pending") {
                    toast.success("Please wait 48-72 hours to get verified");
                } else if (status === "Rejected") {
                    toast.error("Your request has been rejected by the admin");
                } else {
                    toast.success("Login successful!");
                    localStorage.setItem("affiliatedToken", response?.data?.token);
                    window.open(`/affiliated/dashboard/${id}`, '_blank');
                }
            } else {
                toast.error("Invalid credentials");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <User className="w-16 h-16 mx-auto mb-4 text-[#C5AD59]" />
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                            <p className="text-gray-600">Login to your affiliate account</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-sm text-[#C5AD59] hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#C5AD59] text-white py-3 px-6 rounded-md hover:bg-[#b39a4d] transition-colors duration-200 font-medium"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    onClick={() => navigate("/affiliated/register")}
                                    className="text-[#C5AD59] font-semibold hover:underline"
                                >
                                    Register as Affiliate
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AffiliateLogin;