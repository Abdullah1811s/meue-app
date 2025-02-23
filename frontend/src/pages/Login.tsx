import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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
    <div className="w-full h-screen bg-white rounded-lg p-8 flex flex-col md:flex-row">
      <div className="mt-4 text-center">
        <Link
          to="/"
          className="text-[#DBC166] font-semibold whitespace-nowrap text-base hover:underline"
        >
           ← Back to home
        </Link>
      </div>
      {/* Left Side (Form) */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col h-full justify-center p-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-[#C5AD59] text-center mb-6">
          Welcome Back!!
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <div className="relative mt-1">
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
            <label className="text-gray-700 font-medium">Password</label>
            <div className="relative mt-1">
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

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-2 text-center">{errorMessage}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#DBC166] text-white py-2 rounded-md font-semibold hover:bg-[#c5ad59] flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-gray-600 text-sm">
            Forgot Password?
          </Link>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#DBC166] font-semibold">
            Sign up
          </Link>
        </p>

        {/* Back Button */}

      </motion.div>

      {/* Right Side (Illustration) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#DBC166] rounded-t-full mt-6 md:mt-0 h-full">
        <img
          src="lap2.png"
          alt="Illustration"
          className="w-96 h-96"
        />
      </div>
    </div>


  );
};

export default Login;
