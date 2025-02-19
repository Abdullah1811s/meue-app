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
import VendorProtectedRoute from './components/customComponents/VendorProtectedRoute.tsx'
import VendorProfile from './pages/VendorProfile.tsx'
import PrivateRoute from './components/customComponents/ProtectedRoute.tsx'
import ReferralDashboard from './pages/referralDashboard.tsx'
import PayFastRedirect from './pages/PayFast.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    //all public routes
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="vendorOnBoarding" element={<VendorOnboarding />} />
      {/* vendor protected route */}
      <Route path="vendor" element={<VendorProtectedRoute />}>
        <Route path="dashboard/:id" element={<Dashboard />} />
        <Route path="profile/setting/:id" element={<VendorProfile />} />
      </Route>
      <Route path="users" element={<PrivateRoute />}>
        <Route path=":id" element={<Home />} />
        <Route path="referral/:id" element={<ReferralDashboard />} />
        <Route path="payFast" element={<PayFastRedirect />} />
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
