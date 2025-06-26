// src/pages/user/CheckoutSuccessPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const CheckoutSuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
      <FiCheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Your order has been placed successfully. We’ll email you the invoice and shipping details soon.
      </p>

      <div className="flex gap-4">
        <Link
          to="/orders"
          className="px-6 py-2 border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white rounded-md transition"
        >
          View My Orders
        </Link>
        <Link
          to="/products"
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
