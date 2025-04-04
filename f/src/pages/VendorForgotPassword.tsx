import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  businessEmail: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const VendorForgotPassword = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SITE_KEY = import.meta.env.VITE_RECAP;
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/forgot-password`, {
        ...data,
        captchaToken,
      });

      setSuccessMessage(response.data.message || "Password reset link sent to your email");
      toast.success("Password reset link sent!");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to send reset link");
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 shadow-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-6">
          <button
            onClick={() => navigate('/vendor/login')}
            className="flex items-center text-[#C5AD59] hover:text-[#b39a4d] transition-colors mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to login
          </button>
          
          <motion.h2
            className="text-2xl font-bold text-[#C5AD59] mb-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Forgot Password
          </motion.h2>
          
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Enter your business email to receive a password reset link
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 text-sm p-3 rounded-lg"
            >
              {errorMessage}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 text-green-600 text-sm p-3 rounded-lg"
            >
              {successMessage}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                {...register("businessEmail")}
                type="email"
                placeholder="Enter your business email"
                className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
              />
            </div>
            {errors.businessEmail && (
              <p className="text-red-600 text-sm mt-1">{errors.businessEmail.message}</p>
            )}
          </div>

          <ReCAPTCHA
            sitekey={SITE_KEY}
            onChange={handleCaptcha}
          />

          <button
            type="submit"
            className="w-full bg-[#C5AD59] text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#b39a4d] transition-all duration-300 flex items-center justify-center shadow-md"
            disabled={loading || !captchaToken}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <motion.div
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          Don't have an account?{" "}
          <Link
            to="/vendor/register"
            className="text-[#C5AD59] font-semibold hover:underline hover:text-[#b39a4d] transition-colors"
          >
            Register as Vendor
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VendorForgotPassword;