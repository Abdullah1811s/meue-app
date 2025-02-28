import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(), 
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit = async (data: SignUpForm) => {
    
  
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signUp`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      localStorage.setItem("UserToken", response?.data.token);
      setSignupSuccess(true); 
      dispatch(login()); 
      navigate(`/users/${response?.data.user._id}`);
    } catch (error:any) {
      console.error('Signup Error:', error?.response?.data?.message || error?.message);

      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('duplicate email')) {
          setErrorMessage('This email is already registered.');
        } else if (errorMessage.includes('duplicate phone')) {
          setErrorMessage('This phone number is already registered.');
        } else {
          setErrorMessage(errorMessage);  // Other general errors
        }
      } else {
        setErrorMessage('An error occurred, please try again later');
      }
    }
  };



  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
    {/* Left Section (Image) */}
    <div className="flex-1 flex justify-center bg-[#ffffff] rounded-t-full items-center p-4">
      <img src="/sign-up.svg" alt="Illustration"  className="w-auto h-auto"/>
    </div>
  
    {/* Right Section (Form) */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }} // Slower fade-in
      className="flex-1 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }} // Slower entry animation
        className="bg-white p-8 rounded-xl  w-full max-w-md"
      >
        <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 text-left"
      >
        <Link
          to="/" 
          className="text-[#DBC166] hover:text-[#C8A13A] text-sm"
        >
          ← Back to home
        </Link>
      </motion.div>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }} // Slower fade-in for heading
          className="text-3xl font-bold text-center  text-[#C5AD59]"
        >
         lets get you on board
        </motion.h2>
  
        {signupSuccess && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-green-600 font-semibold text-center mt-2"
          >
            Signup successful! Redirecting...
          </motion.p>
        )}
  
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-red-600 font-semibold text-center mt-2"
            >
              {errorMessage}
            </motion.p>
          )}
  
          {/* Email and phone duplication errors */}
          {errors.email && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          {errors.email && errorMessage.includes('duplicate email') && (
            <p className="mt-1 text-sm text-red-600">This email is already registered.</p>
          )}
  
          {errors.phone && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          {errors.phone && errorMessage.includes('duplicate phone') && (
            <p className="mt-1 text-sm text-red-600">This phone number is already registered.</p>
          )}
  
          {/* Form Fields */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Enter your name"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          </motion.div>
  
          {/* Email Field */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }} // More subtle movement
          >
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="example@gmail.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          </motion.div>
  
          {/* Phone Field */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              {...register("phone", { required: true })}
              type="tel"
              placeholder="Enter your phone no"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          </motion.div>
  
          {/* Referral Code Field */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
            <input
              {...register("referralCode")}
              type="text"
              placeholder="Enter referral code if any"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
            />
          </motion.div>
  
          {/* Password Section */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                {...register("password", { required: true })}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          </motion.div>
  
          {/* Confirm Password Section */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                {...register("confirmPassword", { required: true })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">This field is required</p>}
          </motion.div>
  
          {/* Submit Button */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <button
              type="submit"
              className="w-full bg-[#DBC166] text-white py-2 rounded-lg shadow-md hover:bg-[#C8A13A] focus:outline-none focus:ring-2 focus:ring-[#DBC166]"
            >
              Sign Up
            </button>
          </motion.div>
        </form>
  
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }} // Slower transition for the text below
          className="text-center mt-4"
        >
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#DBC166] hover:text-[#C8A13A]">
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
  
  
  );
}

export default SignUp;
