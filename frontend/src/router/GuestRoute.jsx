// src/routers/GuestRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../auth/useAuth";

const GuestRoute = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default GuestRoute;
