import React, { useEffect, useState } from "react";
import {
  getWishlistItems,
  removeFromWishlist,
} from "../../services/wishlistService";
import { addToCart } from "../../services/cartService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlistItems();
      setWishlist(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch wishlist"
      );
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast("Removed from wishlist", {
        icon: "❌",
        style: {
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
          border: "1px solid #fca5a5",
        },
      });

      setWishlist((prev) =>
        prev.filter((item) => {
          const p = item.product || item;
          return p._id !== productId;
        })
      );

      window.dispatchEvent(new Event("update-wishlist-count"));
    } catch {
      toast.error("❌ Failed to remove item");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      toast.success("✅ Added to cart");
      window.dispatchEvent(new Event("update-cart-count"));
    } catch (err) {
      toast.error("❌ Failed to add to cart");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#f8f4ee] py-4">
        <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          &rsaquo; Wishlist
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

        {loading ? (
          <p className="text-gray-500">Loading your wishlist...</p>
        ) : wishlist.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            <p className="text-lg">Your wishlist is empty.</p>
            <Link
              to="/products"
              className="text-blue-600 underline mt-2 inline-block"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const product = item.product || item;

              return (
                <div
                  key={product._id}
                  className="border rounded-lg bg-white p-4 text-center hover:shadow-md transition"
                >
                  <div className="h-52 flex items-center justify-center mb-3">
                    <img
                      src={product.image || "/no-image.png"}
                      alt={product.name}
                      className="object-contain h-full w-full rounded"
                    />
                  </div>

                  <h3 className="text-base font-medium mb-1">{product.name}</h3>
                  <p className="text-gray-700 font-semibold mb-3">
                    Rs. {product.price}
                  </p>

                  <div className="flex flex-col gap-2 items-center">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                      <FaShoppingCart size={14} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleRemove(product._id)}
                      className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                      <FaTrash size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
