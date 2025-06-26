import React, { useEffect, useState } from "react";
import { getCart, updateCartQuantity, removeFromCart } from "../../services/cartService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data.items || []);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantity = async (productId, type) => {
    const item = cartItems.find((i) => i.product._id === productId);
    if (!item) return;

    const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return;

    try {
      await updateCartQuantity(productId, newQty);
      fetchCart();
      window.dispatchEvent(new Event("update-cart-count"));
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast("Item removed", {
        icon: '🗑️',
        style: {
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          border: '1px solid #fca5a5'
        }
      });
      fetchCart();
      window.dispatchEvent(new Event("update-cart-count"));
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      <div className="bg-[#f8f4ee] py-4 border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 text-sm text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 20v-6h4v6h5v-8h3L10 0 2 12h3v8z" />
            </svg>
            <Link to="/" className="underline hover:text-gray-800">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-gray-900">Your Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-10">Your Cart</h1>

        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center text-gray-600 py-20">Your cart is empty.</div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-6 text-sm font-semibold text-gray-600 border-b pb-3">
              <div className="col-span-3">PRODUCT</div>
              <div className="col-span-1 text-center">PRICE</div>
              <div className="col-span-1 text-center">QUANTITY</div>
              <div className="col-span-1 text-end">TOTAL</div>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-6 items-center gap-4 py-4 border-b"
              >
                <div className="col-span-3 flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain border"
                  />
                  <p className="text-sm font-medium">{item.product.name}</p>
                </div>

                <div className="text-center">Rs. {item.product.price}</div>

                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleQuantity(item.product._id, "dec")}
                    className="border px-2 py-1 text-red-600 hover:bg-red-100"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item.product._id, "inc")}
                    className="border px-2 py-1 text-green-600 hover:bg-green-100"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                <div className="text-end font-semibold whitespace-nowrap flex flex-col items-end">
                  <span>Rs. {item.quantity * item.product.price}</span>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-gray-400 hover:text-red-500 text-xs mt-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-10">
              <div className="w-full md:w-1/3 border p-6 rounded-xl bg-white">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <p>Subtotal</p>
                  <p>Rs. {total}</p>
                </div>
                <div className="flex justify-between mb-4 text-lg font-semibold">
                  <p>Total</p>
                  <p>Rs. {total}</p>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Taxes and shipping calculated at checkout
                </p>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-4 py-2 rounded transition"
                >
                  Check out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
