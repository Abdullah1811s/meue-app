import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

type LoginFormData = {
    email: string;
    password: string;
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function VendorLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoginError('');
            const response = await axios.post(`${API_BASE_URL}/vendor/login`, data);
            console.log('Login Successful:', response.data);
            localStorage.setItem('VendorToken', response.data?.token);
            const vendorId = response.data.vendor._id;
            navigate(`/vendor/dashboard/${vendorId}`);
        } catch (error: any) {
            console.error('Login Error:', error.response?.data || error.message);
            setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <Store className="w-16 h-16 mx-auto mb-4 text-[#C5AD59]" />
                    <h2 className="text-3xl font-bold text-gray-800">Vendor Login</h2>
                    <p className="mt-2 text-gray-600">Welcome back! Please sign in to your account</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mb-4"
                >
                    <button
                        onClick={() => { navigate('/') }}
                        className="px-4 py-2 text-[#C5AD59] border border-[#C5AD59] rounded-md hover:bg-[#C5AD59] hover:text-white transition-all duration-200"
                    >
                        Back
                    </button>
                </motion.div>
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                            {loginError}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required"
                                })}
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
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-[#C5AD59] text-white py-2 px-4 rounded-md hover:bg-[#b39b47] transition-colors duration-200 font-semibold"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/vendorOnBoarding"
                                className="text-[#C5AD59] hover:text-[#b39b47] font-semibold transition-colors duration-200"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}

export default VendorLogin;