import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { placeOrder } from "../../services/orderService";
import { getCart } from "../../services/cartService";

import eSewaLogo from "../../assets/esewa.png";
import khaltiLogo from "../../assets/khalti.png";
import codLogo from "../../assets/cod.png"; // ✅ Add this image

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        setCartItems(cart.items);
        setSubTotal(cart.subtotal);
      } catch (error) {
        toast.error("Failed to load cart items", {
          icon: '❌',
          style: {
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5'
          }
        });
        console.error("Cart fetch error:", error);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    if (!phoneNumber || !address) {
      return toast.error("Please fill all required fields", {
        icon: '❌',
        style: {
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          border: '1px solid #fca5a5'
        }
      });
    }

    try {
      setLoading(true);
      const orderData = {
        phone: phoneNumber,
        deliveryAddress: address,
        paymentMethod,
        couponCode: couponCode || null,
      };

      await placeOrder(orderData);
      toast.success("Order placed successfully", {
        icon: '✅',
        style: {
          backgroundColor: '#dcfce7',
          color: '#166534',
          border: '1px solid #86efac'
        }
      });
      navigate("/checkout-success");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to place order",
        {
          icon: '❌',
          style: {
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5'
          }
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold mb-4">Checkout</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Delivery Address</label>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your delivery address"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Payment Method</label>
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-pink-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="eSewa">eSewa</option>
              <option value="Khalti">Khalti</option>
            </select>
            {paymentMethod === "eSewa" && (
              <img
                src={eSewaLogo}
                alt="eSewa"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-14 h-auto object-contain"
              />
            )}
            {paymentMethod === "Khalti" && (
              <img
                src={khaltiLogo}
                alt="Khalti"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-14 h-auto object-contain"
              />
            )}
            {paymentMethod === "COD" && (
              <img
                src={codLogo}
                alt="Cash on Delivery"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-auto object-contain"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Coupon Code (optional)</label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter coupon code"
          />
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-200"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-600">No items in cart</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {cartItems.map((item) => (
              <li key={item._id} className="py-2 flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>Rs. {item.product.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between font-medium text-lg">
            <span>Subtotal:</span>
            <span>Rs. {subTotal}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Shipping and discount applied at server</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;