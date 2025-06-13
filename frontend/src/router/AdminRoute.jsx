// src/routers/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../auth/useAuth";
import toast from "react-hot-toast";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <>Loading...</>;

  if (!user) {
    toast.error("Please login first");
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    toast.error("Access denied! Admins only.");
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
