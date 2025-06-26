import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  registerUserService,
  sendOtp,
  verifyOtp,
  googleLogin,
} from "../../services/authService";
import InlineAlert from "../common/InlineAlert"; 

const RegisterForm = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [agreed, setAgreed] = useState(false);

  const showToast = (type, message) => {
      toast.custom((t) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } max-w-sm mx-auto bg-white shadow-lg rounded-lg p-4`}
  >
    <InlineAlert type={type} message={message} />
  </div>
   ));
  
  };

  useEffect(() => {
    const checkEmail = async () => {
      if (!email) return;
      try {
        const res = await fetch("http://localhost:5000/api/users/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setEmailAvailable(data.available);
      } catch {
        setEmailAvailable(false);
      }
    };
    const timeout = setTimeout(checkEmail, 800);
    return () => clearTimeout(timeout);
  }, [email]);

  const passwordStrength = () => {
    if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    if (password.length > 5) return "Medium";
    return "Weak";
  };

  const handleOtpSend = async () => {
    if (!email) return showToast("error", "Enter email first");
    try {
      await sendOtp(email);
      setOtpSent(true);
      showToast("success", "OTP sent to your email");
    } catch (err) {
      showToast("error", "Failed to send OTP");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp) return showToast("error", "Enter the OTP");
    try {
      const data = await verifyOtp(email, otp, name);
      localStorage.setItem("token", data.token);
      showToast("success", "OTP verified & logged in!");
      navigate("/");
    } catch (err) {
      showToast("error", err.response?.data?.message || "OTP failed");
    }
  };

  const handlePasswordRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return showToast("error", "Passwords do not match");
    if (!agreed) return showToast("error", "You must agree to the terms");
    try {
      const data = await registerUserService({ name, email, password });
      localStorage.setItem("token", data.token);
      showToast("success", "Registered successfully!");
      navigate("/");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Register failed");
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const data = await googleLogin(token);
      localStorage.setItem("token", data.token);
      showToast("success", "Google account created!");
      navigate("/");
    } catch {
      showToast("error", "Google sign up failed");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e75b70] bg-gray-50 transition-all";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTab("password")}
          className={`text-sm px-4 py-2 rounded-full border shadow-sm transition-all duration-200 ${
            tab === "password"
              ? "bg-[#e75b70] text-white border-transparent"
              : "text-gray-600 border-gray-300 bg-white"
          }`}
        >
          Register with Password
        </button>
        <button
          onClick={() => setTab("otp")}
          className={`text-sm px-4 py-2 rounded-full border shadow-sm transition-all duration-200 ${
            tab === "otp"
              ? "bg-[#e75b70] text-white border-transparent"
              : "text-gray-600 border-gray-300 bg-white"
          }`}
        >
          Login/Register with OTP
        </button>
      </div>

      <div className="rounded-2xl ring-1 ring-gray-200 shadow-xl p-6 bg-white transition-transform hover:scale-[1.01]">
        {tab === "password" && (
          <form onSubmit={handlePasswordRegister} className="space-y-4" autoComplete="on">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} autoComplete="name" />
            <div className="relative">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} autoComplete="email" />
              {email && (
                <span className={`absolute right-4 top-3 text-xs ${emailAvailable ? "text-green-600" : "text-red-500"}`}>
                  {emailAvailable ? "Available" : "Taken"}
                </span>
              )}
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} autoComplete="new-password" />
              <div className="absolute inset-y-0 right-4 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
              {password && <p className="text-xs mt-1 text-gray-500">Strength: <span className={`font-medium ${passwordStrength() === "Strong" ? "text-green-600" : passwordStrength() === "Medium" ? "text-yellow-500" : "text-red-500"}`}>{passwordStrength()}</span></p>}
            </div>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} autoComplete="new-password" />

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4" />
              <label className="text-sm text-gray-600">I agree to the terms & conditions</label>
            </div>

            <button type="submit" className="w-full bg-[#e75b70] text-white font-semibold py-3 rounded-lg hover:bg-[#dc4c61] transition">Sign up</button>
          </form>
        )}

        {tab === "otp" && (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <input type="text" placeholder="Full Name (optional)" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} autoComplete="email" />
            {otpSent && <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className={inputClass} />}
            {!otpSent ? (
              <button type="button" onClick={handleOtpSend} className="w-full bg-[#e75b70] text-white font-semibold py-3 rounded-lg hover:bg-[#dc4c61] transition">Send OTP</button>
            ) : (
              <button type="submit" className="w-full bg-[#e75b70] text-white font-semibold py-3 rounded-lg hover:bg-[#dc4c61] transition">Verify & Login</button>
            )}
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">or sign up with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSignup} onError={() => showToast("error", "Google sign up error")} />
        </div>

        <div className="text-center text-sm mt-6">
          Already have an account? <Link to="/login" className="text-[#e75b70] font-medium hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
