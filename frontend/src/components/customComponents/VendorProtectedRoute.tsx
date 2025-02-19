import { Outlet, Navigate, useLocation } from "react-router-dom";

const VendorProtectedRoute = () => {
  const token = localStorage.getItem("VendorToken");
  const location = useLocation();

  if (!token) return <Navigate to="/" />;
  return location.pathname === "/vendor" ? <Navigate to="/vendor/dashboard" /> : <Outlet />;
};

export default VendorProtectedRoute;
