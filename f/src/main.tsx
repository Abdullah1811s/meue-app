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

import PayFastRedirect from './pages/PayFast.tsx'
import AffiliateRegistration from './pages/AffiliateRegistration.tsx'

import AdminDashboard from './pages/AdminDashboard.tsx'
import AffiliateLogin from './pages/AffiliateLogin.tsx'

import AffiliatedDashboard from './pages/AffiliatedDashboad.tsx'
import VendorLogin from './pages/VendorLogin.tsx'

//components
import { VendorProtectedRoute, PrivateRoute, AdminProtectedRoute, AffiliatedProtectedRoute } from "@/components/customComponents/index.tsx"
import AllPartners from './pages/AllPartners.tsx'
import ManagePartner from './components/customComponents/ManagePartner.tsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="vendorOnBoarding" element={<VendorOnboarding />} />
      <Route path="allPartners" element={<AllPartners />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/affiliated/register" element={<AffiliateRegistration />} />
      <Route path="/affiliated/login" element={<AffiliateLogin />} />

      {/* Vendor Protected Routes */}
      <Route path="vendor" element={<VendorProtectedRoute />}>
        <Route path="dashboard/:id" element={<Dashboard />} />
        <Route path="profile/setting/:id" element={<VendorProfile />} />
        <Route path=":id" element={<Home />} />
      </Route>

      {/* User Protected Routes */}
      <Route path="users" element={<PrivateRoute />}>
        <Route path=":id" element={<Home />} />
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
