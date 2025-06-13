import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
  try {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    setUser(decoded);
  } catch (err) {
    console.error("Invalid token during login()", err);
    localStorage.removeItem("token");
    setUser(null);
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
