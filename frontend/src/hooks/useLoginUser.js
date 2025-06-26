import { useMutation } from "@tanstack/react-query";
import { loginUserService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const useLoginUser = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await loginUserService({ email, password });
      return res;
    },

    onSuccess: (res, _variables, context) => {
      const token = res?.token;
      if (!token) {
        console.log("❌ No token in response");
        context?.onError?.("No token received");
        return;
      }

      try {
        // ✅ Decode before login
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const isAdmin = decoded.role === "admin";

        // ✅ Store token and user in context
        login(token);

        // ✅ Navigate based on role
        if (isAdmin) {
          console.log("✅ Admin detected, navigating to /admin/dashboard");
          navigate("/admin/dashboard");
        } else {
          console.log("✅ Normal user, navigating to /dashboard");
          navigate("/dashboard");
        }

        context?.onSuccess?.();
      } catch (err) {
        console.log("❌ Error decoding token or redirecting:", err);
        context?.onError?.("Login error");
      }
    },

    onError: (err, _variables, context) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      console.log("❌ Login error:", message);
      context?.onError?.(message);
    },
  });
};

export default useLoginUser;
