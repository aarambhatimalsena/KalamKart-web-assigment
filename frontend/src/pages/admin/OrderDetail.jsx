// src/pages/admin/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-gray-500">Loading order...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Order Detail</h2>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold">Order ID:</p>
          <p>{order._id}</p>
        </div>
        <div>
          <p className="font-semibold">User:</p>
          <p>{order.user?.name} ({order.user?.email})</p>
        </div>
        <div>
          <p className="font-semibold">Total:</p>
          <p>₹{order.totalAmount?.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-semibold">Status:</p>
          <p>{order.status}</p>
        </div>
        <div>
          <p className="font-semibold">Paid:</p>
          <p className="flex items-center gap-1">
            {order.isPaid ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}{" "}
            {order.isPaid ? "Paid" : "Not Paid"}
          </p>
        </div>
        <div>
          <p className="font-semibold">Payment Method:</p>
          <p>{order.paymentMethod}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold">Delivery Address:</p>
          <p>{order.deliveryAddress}</p>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-3">Items</h3>
      <div className="space-y-4">
        {order.items?.map((item) => (
          <div
            key={item._id}
            className="border p-3 rounded flex items-center gap-4"
          >
            <img
              src={item.product?.image || "/no-image.png"}
              alt={item.product?.name || "Deleted Product"}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold">
                {item.product?.name || (
                  <span className="text-red-500 italic">Deleted Product</span>
                )}
              </p>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
              </p>
            </div>
            <div className="font-semibold">
              ₹{(item.price * item.quantity)?.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
