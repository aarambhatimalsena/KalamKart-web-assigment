import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useLoginUser from "../../hooks/useLoginUser";
import { sendOtp, verifyOtp } from "../../services/authService";
import { useAuth } from "../../auth/AuthProvider";
import toast from "react-hot-toast";
import InlineAlert from "../common/InlineAlert";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const { login } = useAuth();
  const { mutate: loginUser, isPending } = useLoginUser();
  const navigate = useNavigate();

  const [tab, setTab] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const showToast = (type, message) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } absolute top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 ${
          type === "error" ? "border-red-500" : "border-green-500"
        } shadow-lg rounded-lg`}
      >
        <InlineAlert type={type} message={message} />
      </div>
    ));
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e75b70] bg-gray-50 transition-all";

  const handlePasswordLogin = (e) => {
    e.preventDefault();

    loginUser(
      { email, password },
      {
        onSuccess: () => {
          showToast("success", "Login successful!");
        },
        onError: (error) => {
          const msg = error?.message || "Login failed";
          if (msg.includes("User does not exist")) {
            showToast("error", "User does not exist. Please register first.");
          } else {
            showToast("error", "Invalid email or password.");
          }
        },
      }
    );
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      await sendOtp(email);
      setOtpSent(true);
      showToast("success", "OTP sent to your email");
    } catch (err) {
      showToast("error", "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      const res = await verifyOtp({ email, otp });

      if (res?.token) {
        login(res.token);
        showToast("success", "OTP login successful!");

        const decoded = JSON.parse(atob(res.token.split(".")[1]));
        if (decoded.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        showToast("error", "Invalid token received from server");
      }
    } catch (err) {
      showToast("error", "OTP login failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("/api/users/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        toast.success("Google login successful!");

        const decoded = JSON.parse(atob(data.token.split(".")[1]));
        if (decoded.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (error) {
      toast.error("Google login error");
    }
  };

  return (
    <div className="relative max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTab("password")}
          className={`text-sm px-4 py-2 rounded-full border shadow-sm transition-all duration-200 ${
            tab === "password"
              ? "bg-[#e75b70] text-white border-transparent"
              : "text-gray-600 border-gray-300 bg-white"
          }`}
        >
          Sign in with Password
        </button>
        <button
          onClick={() => setTab("otp")}
          className={`text-sm px-4 py-2 rounded-full border shadow-sm transition-all duration-200 ${
            tab === "otp"
              ? "bg-[#e75b70] text-white border-transparent"
              : "text-gray-600 border-gray-300 bg-white"
          }`}
        >
          Sign in with OTP
        </button>
      </div>

      {/* Login Card */}
      <div className="rounded-2xl ring-1 ring-gray-200 shadow-xl p-6 bg-white transition-transform hover:scale-[1.01] relative">
        {tab === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
              <div
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <Link to="/forgot-password" className="hover:underline">
                Forgot your password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-[#e75b70] text-white py-3 rounded-md font-medium hover:bg-[#dc4c61] transition"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {tab === "otp" && (
          <form onSubmit={handleOtpLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className={inputClass}
              />
            )}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-[#e75b70] text-white py-3 rounded-md hover:bg-[#dc4c61] transition"
                disabled={otpLoading}
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#e75b70] text-white py-3 rounded-md hover:bg-[#dc4c61] transition"
                disabled={otpLoading}
              >
                {otpLoading ? "Verifying..." : "Verify & Login"}
              </button>
            )}
          </form>
        )}

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error("Google login failed")}
          />
        </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{" "}
        <Link to="/register" className="text-[#e75b70] font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
