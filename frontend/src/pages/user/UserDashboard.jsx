// src/pages/user/UserDashboard.jsx
import React from "react";
import Header from "../../layouts/Header";
import useAuth from "../../auth/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-4 text-[#e75b70]">
          User Dashboard
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-2">
          <p><strong>Welcome:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </section>
    </>
  );
};

export default UserDashboard;
