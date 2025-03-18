import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userLogin } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;


const Login = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SITE_KEY = import.meta.env.VITE_RECAP;
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isVendorAuthenticated = useSelector((state: any) => state.auth.isVendorAuthenticated);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const handleCaptcha = (token: any) => {
    setCaptchaToken(token);
  };
  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/Login`, {
        ...data,
        captchaToken, 
      });
      console.log(response.data)
      const { token, admin, user } = response.data;
      if (token) {
        if (admin) {
          localStorage.setItem("AdminToken", token);
          navigate(`/admin/dashboard/${admin._id}`);
        } else if (user) {
          localStorage.setItem("UserToken", token);

          dispatch(userLogin());
          localStorage.setItem("id", user._id);
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
    <>
      {isVendorAuthenticated ? (

        <motion.div
          className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
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
              You are currently logged in as a vendor. Please log out first if you want to access a different account.
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
        </motion.div>
      ) : (
        // Original login form
        <div className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 flex flex-col md:flex-row">
          {/* Left Side (Form) */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col md:pr-4 mb-2 mt-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center md:text-left max-w-md mx-auto w-full">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#DBC166] ml-4 mb-2">
                Welcome Back!
              </h2>

              <p className="text-gray-600 mb-6 ml-4">
                Let's pick up where you left off
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 bg-white p-4 sm:p-6 rounded-xl outline-none w-full">
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
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-md border border-gray-300 focus:ring-[#DBC166] focus:border-[#DBC166] outline-none"
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
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2 sm:py-3 rounded-md border border-gray-300 focus:ring-[#DBC166] focus:border-[#DBC166] outline-none"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <ReCAPTCHA
                  sitekey={SITE_KEY}
                  onChange={handleCaptcha}
                />
                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#DBC166] to-[#C8A13A] text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-[#C8A13A] hover:to-[#B8943A] transition-all duration-300 flex items-center justify-center shadow-md"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#DBC166] font-semibold hover:underline transition-colors">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>

          {/* Right Side (Welcome Message) */}
          <div className="w-full md:w-1/2 flex flex-col bg-white rounded-xl md:rounded-tr-3xl md:rounded-br-3xl p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-lg mx-auto flex flex-col items-center md:items-start"
            >
              {/* Fixed position and alignment for consistent heading */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#DBC166] mb-4 sm:mb-6 text-center md:text-left"
              >
                Your exclusive world of benefits awaits
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="w-full max-w-md mx-auto mt-4 sm:mt-6"
              >
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#C5AD59] mb-2 sm:mb-3 text-center md:text-left">Ready to access:</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start">
                      <span className="text-[#DBC166] mr-2 flex-shrink-0">✓</span>
                      <span className="text-gray-700">Your personalized dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DBC166] mr-2 flex-shrink-0">✓</span>
                      <span className="text-gray-700">Exclusive member discounts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DBC166] mr-2 flex-shrink-0">✓</span>
                      <span className="text-gray-700">Premium vendor offerings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#DBC166] mr-2 flex-shrink-0">✓</span>
                      <span className="text-gray-700">Special events and promotions</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 sm:mt-6 text-center md:text-left">
                  <Link
                    to="/"
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-white border border-[#DBC166] rounded-lg text-[#DBC166] font-medium hover:bg-[#DBC166] hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <Home className="mr-2" size={18} />
                    Back to home
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
