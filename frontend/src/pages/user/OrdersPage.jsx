import React, { useEffect, useState } from "react";
import { getUserOrders, downloadInvoice } from "../../services/orderService";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await downloadInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Invoice download failed", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">
          <FaBoxOpen className="mx-auto text-5xl mb-2" />
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p className="font-medium">
                  Order ID: <span className="text-gray-700">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Items: {order.items.length} | Total: Rs. {order.totalAmount}
                </p>
                <p className="text-sm">
                  Status: <span className="capitalize text-blue-600">{order.status}</span>
                </p>
              </div>

              <div className="mt-3 md:mt-0 flex gap-3">
                <Link
                  to={`/orders/${order._id}`}
                  className="text-sm text-white bg-gray-800 px-3 py-1.5 rounded hover:bg-gray-700"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDownloadInvoice(order._id)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FiDownload /> Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;