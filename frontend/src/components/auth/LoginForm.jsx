import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import InlineAlert from "../common/InlineAlert";
import useLoginUser from "../../hooks/useLoginUser";
import { sendOtp, verifyOtp } from "../../services/authService";

const LoginForm = () => {
  const { mutate: loginUser, isPending } = useLoginUser();

  const [tab, setTab] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e75b70] bg-gray-50 transition-all";

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      await sendOtp(email);
      setOtpSent(true);
    } catch (err) {
      console.error("OTP send failed:", err);
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
        loginUser({ email, token: res.token }); // Use hook mutation
      }
    } catch (err) {
      console.error("OTP login failed:", err);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
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

      <div className="rounded-2xl ring-1 ring-gray-200 shadow-xl p-6 bg-white transition-transform hover:scale-[1.01]">
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
