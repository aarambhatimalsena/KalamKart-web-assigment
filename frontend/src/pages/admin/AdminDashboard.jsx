import React from "react";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaTags,
  FaList,
  FaStar,
} from "react-icons/fa";
import ProductTable from "../../components/admin/ProductTable";
import useAdminStats from "../../hooks/useAdminStats";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats = {}, isLoading, isError } = useAdminStats();
  const navigate = useNavigate();

  if (isLoading) return <p className="text-sm text-gray-500">Loading stats...</p>;
  if (isError) return <p className="text-sm text-red-500">Failed to load stats</p>;

  // Tab configurations
  const tabs = [
    { label: "Products", path: "/admin/products" },
    { label: "Categories", path: "/admin/categories" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Reviews", path: "/admin/reviews" },
    { label: "Coupons", path: "/admin/coupons" },
    { label: "Users", path: "/admin/users" },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mb-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome to KalamKart Admin
        </h2>
        <p className="text-gray-600">
          Manage your e-commerce platform with ease and efficiency.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Products</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {stats.totalProducts?.toLocaleString() || 0} <FaBox className="text-pink-600" />
          </div>
        </div>
        <div className="bg-white border p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Users</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {stats.totalUsers?.toLocaleString() || 0} <FaUsers className="text-yellow-500" />
          </div>
        </div>
        <div className="bg-white border p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {stats.totalOrders?.toLocaleString() || 0} <FaShoppingCart className="text-red-400" />
          </div>
        </div>
        <div className="bg-white border p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Revenue</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            ₹{stats.totalSales?.toLocaleString() || 0} <FaRupeeSign className="text-green-600" />
          </div>
        </div>
        <div
          className="bg-white border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
          onClick={() => navigate("/admin/coupons")}
        >
          <div className="text-sm text-gray-600 mb-1">Coupons</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTags className="text-blue-500" /> Manage
          </div>
        </div>
      </div>

      {/* Horizontal Tabs - Clickable */}
      <div className="flex gap-3 flex-wrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition"
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white p-4 border rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Products Management</h3>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Add New Product
          </button>
        </div>

        <ProductTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
