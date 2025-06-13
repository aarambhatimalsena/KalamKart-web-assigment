// src/routers/AppRouter.jsx
import { Routes, Route } from "react-router-dom";

// Route wrappers
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import NormalUserRoute from "./NormalUserRoute";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/Home";      
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<HomePage />} />

      {/* Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin-only routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Normal user-only routes */}
      <Route element={<NormalUserRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
