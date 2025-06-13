import React from "react";
import AppRouter from "./router/AppRouter";
import { Toaster } from "react-hot-toast";
import useAuth from "./auth/useAuth"; // 👈 add this

const App = () => {
  const { loading } = useAuth(); // 👈 get loading from AuthProvider

  if (loading) return null; // ⛔ wait until token decoded

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRouter />
    </>
  );
};

export default App;
