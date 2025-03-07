import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/Login`, data);
      const { token, admin, user } = response.data;
      if (token) {
        if (admin) {
          localStorage.setItem("AdminToken", token);
          navigate(`/admin/dashboard/${admin._id}`);
        } else if (user) {
          localStorage.setItem("UserToken", token);
          dispatch(login());
          navigate(`/users/${user._id}`);
        } else {
          setErrorMessage("Invalid user type.");
        }
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white p-8 flex flex-col md:flex-row">
      {/* Left Side (Form) */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col h-full  p-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >


        {/* Changed heading alignment to be consistent */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#DBC166] mt-3">
          Welcome Back!
        </h2>

        <p className="text-gray-600 mb-8">
          Let's pick up where you left off
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-8 rounded-xl shadow-md">
          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-gray-700 font-medium block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" />
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-[#DBC166] focus:border-[#DBC166] outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-700 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:ring-[#DBC166] focus:border-[#DBC166] outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-gray-600 text-sm hover:text-[#DBC166]">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#DBC166] to-[#C8A13A] text-white py-3 rounded-lg font-semibold hover:from-[#C8A13A] hover:to-[#B8943A] transition-all duration-300 flex items-center justify-center shadow-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#DBC166] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>

      {/* Right Side (Welcome Message) */}
      <div className="w-full md:w-1/2 flex flex-col  bg-white rounded-tr-3xl rounded-br-3xl shadow-lg p-8 mt-6 md:mt-0 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg mx-auto"
        >
          {/* Fixed position and alignment for consistent heading */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#DBC166] mb-6"
          >
            Your exclusive world of benefits awaits
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-md mx-auto mt-6"
          >
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-[#C5AD59] mb-3">Ready to access:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#DBC166] mr-2">✓</span>
                  <span className="text-gray-700">Your personalized dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DBC166] mr-2">✓</span>
                  <span className="text-gray-700">Exclusive member discounts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DBC166] mr-2">✓</span>
                  <span className="text-gray-700">Premium vendor offerings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DBC166] mr-2">✓</span>
                  <span className="text-gray-700">Special events and promotions</span>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-white border border-[#DBC166] rounded-lg text-[#DBC166] font-medium hover:bg-[#DBC166] hover:text-white transition-all duration-300 shadow-sm"
              >
                <Home className="mr-2" />
                Back to home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>

  );
};

export default Login;
