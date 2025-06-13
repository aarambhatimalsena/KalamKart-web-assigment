import { useMutation } from "@tanstack/react-query";
import { loginUserService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { toast } from "react-toastify";

const useLoginUser = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      console.log("📤 Sending login data:", data);
      const res = await loginUserService(data);
      console.log("✅ Login response:", res);
      return res;
    },
    onSuccess: (res) => {
      const token = res?.token;
      console.log("🧪 Received token:", token);

      if (!token) {
        toast.error("No token received");
        return;
      }

      try {
        login(token);
        toast.success("Login successful!");

        console.log("➡️ Navigating to /");
        navigate("/"); // ✅ this must happen
      } catch (err) {
        console.error("❌ Error during login or navigation:", err);
      }
    },
    onError: (err) => {
      console.error("❌ useLoginUser error:", err);
      toast.error(err?.response?.data?.message || "Login failed");
    },
  });
};


export default useLoginUser;
