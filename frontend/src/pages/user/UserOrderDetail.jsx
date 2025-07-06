import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderByIdUser } from "../../services/orderService";

const UserOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderByIdUser(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-gray-500 text-center mt-8">Loading order...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!order) return <p className="text-center mt-8">No order found.</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="border border-gray-200 rounded-xl bg-white shadow-md p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center gap-2">
          <span role="img" aria-label="invoice">🧾</span> Order Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-800">
          <div>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                order.status === "Delivered" ? "bg-green-100 text-green-700" :
                "bg-gray-200 text-gray-700"
              }`}>
                {order.status}
              </span>
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              <span className={`font-semibold ${order.isPaid ? "text-green-600" : "text-red-600"}`}>
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            </p>
          </div>

          <div>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            {order.discount > 0 && <p><strong>Discount:</strong> ₹{order.discount}</p>}
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
          </div>
        </div>

        <hr className="my-5" />

        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span role="img" aria-label="box">📦</span> Items Ordered
        </h3>

        <div className="space-y-4">
          {order.items.map(item => (
            <div
              key={item._id}
              className="flex items-center gap-4 border rounded-lg p-3 shadow-sm"
            >
              <img
                src={item.product?.image || "/no-image.png"}
                alt={item.product?.name || "Deleted Product"}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">
                  {item.product?.name || <span className="text-red-500">Deleted Product</span>}
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  Subtotal: ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetail;
