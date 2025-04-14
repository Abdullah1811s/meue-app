import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux";
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Home from './pages/waitingPage.tsx'
import VendorOnboarding from './pages/VendorOnBoard.tsx'
import store from './store/store.ts'
import Dashboard from './pages/DashBoard.tsx'
import VendorProfile from './pages/VendorProfile.tsx'
import AffiliateRegistration from './pages/AffiliateRegistration.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import AffiliateLogin from './pages/AffiliateLogin.tsx'
import AffiliatedDashboard from './pages/AffiliatedDashboad.tsx'
import VendorLogin from './pages/VendorLogin.tsx'
//components
import { VendorProtectedRoute, PrivateRoute, AdminProtectedRoute, AffiliatedProtectedRoute } from "@/components/customComponents/index.tsx"
import AllPartners from './pages/AllPartners.tsx'
import ManagePartner from './components/customComponents/ManagePartner.tsx'
import CompletedRafflesPage from './pages/CompletedRafflesPage.tsx'
import PaymentSuccess from './pages/PaymentSucces.tsx'
import PaymentCancel from './pages/PaymentCancel.tsx'
import PaymentFailure from './pages/PaymentFailed.tsx'

import UserDash from './pages/userDashboard.tsx'
import ComRule from './pages/ComRule.tsx'
import FAQPage from './pages/FAQ.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy.tsx'
import TermsOfService from './pages/TOS.tsx'
import GeneralTermPdf from './pages/GeneralTerms.tsx'
import PartnerProgramTerms from './pages/PartnerProgramTerms .tsx'
import AboutUs from './pages/Aboutus.tsx'
import ForgotPassword from './pages/ForgetPass.tsx'
import ResetPassword from './pages/ResetPass.tsx'
import AffiliateForgotPassword from './pages/AffiliateForgotPassword.tsx'
import AffiliateResetPassword from './pages/AffiliateResetPassword.tsx'
import VendorForgotPassword from './pages/VendorForgotPassword.tsx'
import VendorResetPassword from './pages/VendorResetPassword.tsx'
import NotFound from './pages/NotFound.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="vendorOnBoarding" element={<VendorOnboarding />} />
      <Route path="aboutUs" element={<AboutUs />} />
      <Route path="allPartners" element={<AllPartners />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
      <Route path="/vendor/reset-password/:token" element={<VendorResetPassword />} />
      <Route path="/affiliated/register" element={<AffiliateRegistration />} />
      <Route path="/affiliated/forgot-password" element={<AffiliateForgotPassword />} />
      <Route path="/affiliate/reset-password/:token" element={<AffiliateResetPassword />} />
      <Route path="/affiliated/login" element={<AffiliateLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/doc/generalTerm" element={<GeneralTermPdf />} />
      <Route path="/doc/PartnerProgram" element={<PartnerProgramTerms />} />
      <Route path="/doc/ComRule" element={<ComRule />} />
      <Route path="/doc/FAQ" element={<FAQPage />} />
      <Route path="/doc/Privacy" element={<PrivacyPolicy />} />
      <Route path="/doc/TOS" element={<TermsOfService />} />



      {/* Vendor Protectnaved Routes */}
      <Route path="vendor/:id" element={<VendorProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="setting" element={<VendorProfile />} />
      </Route>


      {/* User Protected Routes */}
      <Route path="users/:id" element={<PrivateRoute />}>
        <Route path="draw" element={<CompletedRafflesPage />} />
        <Route path="success" element={<PaymentSuccess />} />
        <Route path="failure" element={<PaymentFailure />} />
        <Route path="cancel" element={<PaymentCancel />} />
        <Route path="dashboard" element={<UserDash />} />
        <Route path="" element={<Home />} />
      </Route>


      {/* admin protected route */}
      <Route path="admin" element={<AdminProtectedRoute />}>
        <Route path="dashboard/:id" element={<AdminDashboard />} />
        <Route path="manageAffiliated" element={<AdminDashboard />} />
        <Route path="managePartner" element={<ManagePartner />} />
      </Route>

      {/* affiliated protected route */}
      <Route path="affiliated" element={<AffiliatedProtectedRoute />}>
        <Route path="dashboard/:id" element={<AffiliatedDashboard />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
