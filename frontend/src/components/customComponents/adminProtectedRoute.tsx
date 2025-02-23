import { Outlet, Navigate, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("AdminToken");
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;
  return location.pathname === "/admin" ? <Navigate to="/admin/dashboard" /> : <Outlet />;
};

export default AdminProtectedRoute;
