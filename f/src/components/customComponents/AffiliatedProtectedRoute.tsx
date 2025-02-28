import { Outlet, Navigate, useLocation } from "react-router-dom";

const VendorProtectedRoute = () => {
  const token = localStorage.getItem("affiliatedToken");
  const location = useLocation();

  if (!token) return <Navigate to="/" />;
  return location.pathname === "/affiliated" ? <Navigate to="/affiliated" /> : <Outlet />;
};

export default VendorProtectedRoute;
