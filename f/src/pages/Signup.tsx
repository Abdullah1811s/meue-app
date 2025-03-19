import { useState } from 'react';
import { Eye, EyeOff, Home } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userLogin } from '../store/authSlice';
import ReCAPTCHA from "react-google-recaptcha";
const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  street: z.string().min(1, 'Street address is required'),
  town: z.string().min(1, 'Suburb/Town is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
  geolocation: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;
function SignUp() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SITE_KEY = import.meta.env.VITE_RECAP;
  const provinceCities = {
    "Eastern Cape": ["Gqeberha (Port Elizabeth)", "East London", "Mthatha", "Queenstown", "Grahamstown", "King William’s Town"],
    "Free State": ["Bloemfontein", "Welkom", "Bethlehem", "Sasolburg", "Parys", "Kroonstad"],
    "Gauteng": ["Johannesburg", "Pretoria", "Sandton", "Midrand", "Centurion", "Soweto", "Benoni", "Boksburg", "Kempton Park", "Alberton", "Vanderbijlpark"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Pinetown", "Umhlanga", "Ballito", "Margate"],
    "Limpopo": ["Polokwane", "Tzaneen", "Mokopane", "Thohoyandou", "Bela-Bela", "Lephalale"],
    "Mpumalanga": ["Mbombela (Nelspruit)", "Witbank (eMalahleni)", "Middelburg", "Secunda", "Barberton", "Sabie"],
    "Northern Cape": ["Kimberley", "Upington", "Springbok", "De Aar", "Kuruman", "Colesberg"],
    "North West": ["Mahikeng", "Rustenburg", "Klerksdorp", "Potchefstroom", "Brits", "Lichtenburg"],
    "Western Cape": ["Cape Town", "Stellenbosch", "George", "Paarl", "Worcester", "Mossel Bay", "Knysna"]
  };

  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<keyof typeof provinceCities | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const [captchaToken, setCaptchaToken] = useState(null);
  const handleCaptcha = (token: any) => {
    setCaptchaToken(token);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });


  const onSubmit = async (data: SignUpForm) => {

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signUp`, { ...data, captchaToken }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      localStorage.setItem("UserToken", response?.data.token);
      setSignupSuccess(true);
      dispatch(userLogin());
      navigate(`/users/${response?.data.user._id}`);
    } catch (error: any) {
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Section (Welcome Banner) */}
      <div className="flex-1 flex flex-col items-center mt-11 bg-white lg:rounded-tr-3xl lg:rounded-br-3xl p-8 lg:p-12 ">
        <div className="max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl lg:text-4xl font-bold text-[#DBC166] mb-6 text-center"
          >
            Almost there…
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl text-gray-600 text-center mb-8"
          >
            Just a few more steps to unlock your world of benefits!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-md mx-auto mt-6"
          >
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-[#C5AD59] mb-3">Benefits awaiting you:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#DBC166] mr-2">✓</span>
                  <span className="text-gray-700">Exclusive deals from premium Partner</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DBC166] mr-2">✓</span>
                  <span className="text-gray-700">Personalized recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DBC166] mr-2">✓</span>
                  <span className="text-gray-700">Early access to special promotions</span>
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

        </div>
      </div>

      {/* Right Section (Form) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="flex-1 flex items-center justify-center p-4 lg:p-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >


          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl font-bold text-center text-[#C5AD59] mb-2"
          >
            Let's Get You On Board
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 text-center mb-6"
          >
            Complete your profile to start enjoying the benefits
          </motion.p>

          {signupSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-green-50 text-green-600 font-semibold text-center p-3 rounded-lg mb-4"
            >
              Signup successful! Redirecting...
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* Error Messages */}
            {errorMessage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-red-50 text-red-600 font-semibold text-center p-3 rounded-lg mb-4">
                {errorMessage}
              </motion.div>
            )}

            {/* Form Fields - using grid for better layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register("name")} type="text" placeholder="Enter your full name (as per ID)" className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </motion.div>

              {/* Email Address */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input {...register("email")} type="email" placeholder="Enter your email (used for login/OTP)" className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </motion.div>

              {/* Mobile Number */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input {...register("phone")} type="tel" placeholder="Enter your mobile number" className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </motion.div>

              {/* Address Section - with a nice divider */}
              <div className="md:col-span-2 pt-2 pb-1">
                <div className="flex items-center">
                  <div className="flex-grow h-px bg-gray-200"></div>
                  <span className="px-3 text-sm text-gray-500 font-medium">Address Information</span>
                  <div className="flex-grow h-px bg-gray-200"></div>
                </div>
              </div>

              {/* Street Address */}
              <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input {...register("street")} type="text" placeholder="Enter street address" className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" />
                {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
              </motion.div>

              {/* Suburb/Town */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suburb/Town</label>
                <input {...register("town")} type="text" placeholder="Enter suburb/town" className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" />
                {errors.town && <p className="mt-1 text-sm text-red-600">{errors.town.message}</p>}
              </motion.div>

              {/* City */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select {...register("province")} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" onChange={(e: any) => setSelectedProvince(e.target.value)}>
                  <option value="">Select Province</option>
                  {Object.keys(provinceCities).map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>}
              </motion.div>

              {/* City */}
              <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select {...register("city")} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" disabled={!selectedProvince}>
                  <option value="">{selectedProvince ? "Select City" : "Select a Province First"}</option>
                  {selectedProvince && provinceCities[selectedProvince].map((city: string) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
              </motion.div>



              {/* Postal Code */}
              <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input {...register("postalCode")} type="text" placeholder="Enter postal code" className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" />
                {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
              </motion.div>

              {/* Security Section - with a nice divider */}
              <div className="md:col-span-2 pt-2 pb-1">
                <div className="flex items-center">
                  <div className="flex-grow h-px bg-gray-200"></div>
                  <span className="px-3 text-sm text-gray-500 font-medium">Security</span>
                  <div className="flex-grow h-px bg-gray-200"></div>
                </div>
              </div>

              {/* Password */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-sm text-gray-600"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-sm text-gray-600"
                >
                  {showConfirmPassword ? <Eye /> : <EyeOff />}
                </button>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </motion.div>


              {/* Referral Code */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 1.1 }} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
                <input {...register("referralCode")} type="text" placeholder="Enter referral code if available" className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#DBC166] focus:ring-[#DBC166]" />
                {errors.referralCode && <p className="mt-1 text-sm text-red-600">{errors.referralCode.message}</p>}
              </motion.div>
            </div>
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={handleCaptcha}
            />

            {/* Submit Button */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.3 }}
              className="mt-6"
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#DBC166] to-[#C8A13A] text-white py-3 rounded-lg shadow-md hover:from-[#C8A13A] hover:to-[#B8943A] focus:outline-none focus:ring-2 focus:ring-[#DBC166] transition-all duration-300 font-medium"
              >
                Create Account
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#DBC166] hover:text-[#C8A13A] font-medium">
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
