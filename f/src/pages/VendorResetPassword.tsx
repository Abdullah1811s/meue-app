import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/\d/, "Must contain at least one number"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

const VendorResetPassword = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.put(`${API_BASE_URL}/vendor/reset-password/${token}`, {
        password: data.password
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to reset password");
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100 shadow-md text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-[#C5AD59] mb-4">Password Reset Successful</h2>
          <p className="text-gray-600 mb-6">Your password has been updated successfully.</p>
          <button
            onClick={() => navigate('/vendor/login')}
            className="w-full bg-[#C5AD59] text-white py-3 rounded-lg font-semibold hover:bg-[#b39a4d] transition-all duration-300"
          >
            Back to Login
          </button>
        </motion.div>
      </motion.div>
    );
  }

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
            Reset Password
          </motion.h2>
          
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Enter your new password below
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full pl-10 pr-10 py-2 sm:py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-10 py-2 sm:py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#C5AD59] text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#b39a4d] transition-all duration-300 flex items-center justify-center shadow-md"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VendorResetPassword;