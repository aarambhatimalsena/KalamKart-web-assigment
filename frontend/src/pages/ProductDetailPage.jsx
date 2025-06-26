import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, createReview } from "../services/productService";
import { FaHeart } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";
import toast from "react-hot-toast";
import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { addToCart } from "../services/cartService"; 

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    } catch {
      toast.error("❌ Failed to fetch product");
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!isAuthenticated) {
      setIsWishlisted(false);
      return;
    }
    try {
      const items = await getWishlistItems();
      const wishlisted = items.some(
        (item) => (item.product ? item.product._id : item._id) === id
      );
      setIsWishlisted(wishlisted);
    } catch {
      setIsWishlisted(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    checkWishlistStatus();
  }, [id, isAuthenticated]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast("🚫 Please log in to manage your wishlist.", {
        icon: "❌",
        style: {
          border: "1px solid #f87171",
          padding: "12px",
          color: "#991b1b",
          background: "#fee2e2",
        },
      });
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(id);
        toast("❌ Removed from wishlist");
      } else {
        await addToWishlist([id]);
        toast.success("✅ Added to wishlist");
      }
      setIsWishlisted(!isWishlisted);
      window.dispatchEvent(new Event("update-wishlist-count"));
    } catch {
      toast.error("❌ Wishlist update failed");
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast("🚫 Please log in to add to cart", {
        icon: "❌",
        style: {
          border: "1px solid #f87171",
          padding: "12px",
          color: "#991b1b",
          background: "#fee2e2",
        },
      });
      navigate("/login");
      return;
    }

    try {
      await addToCart(product._id, quantity);
      toast.success("✅ Added to cart");
      window.dispatchEvent(new Event("update-cart-count"));
      navigate("/cart");
    } catch {
      toast.error("❌ Failed to add to cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview(product._id, { rating, comment });
      toast.success("✅ Review submitted!");
      setRating(0);
      setComment("");
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error submitting review");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!product) return <div className="p-6 text-center">Product not found.</div>;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#f5f1eb] py-4 px-6 text-sm text-gray-700">
        <div className="max-w-5xl mx-auto flex justify-center items-center gap-2">
          <FiHome className="inline-block w-4 h-4" />
          <Link to="/" className="underline hover:text-gray-800">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[450px] object-contain rounded-xl border"
          />
        </div>

        {/* Right */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-red-500 text-xl font-bold mb-1">
            Rs. {product.price.toFixed(2)}
          </p>
          <p className="text-sm text-red-600 mb-4">Hurry, only a few left!</p>
          <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-4">
            <div
              className="h-full bg-red-400 rounded"
              style={{ width: `${product.stock}%` }}
            ></div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block font-medium text-sm mb-1">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-3 py-1 border rounded text-lg"
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              className="w-full border border-gray-800 text-gray-800 hover:bg-gray-100 px-6 py-3 rounded text-sm font-medium"
            >
              Add to cart
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#e74c6b] hover:bg-[#d63f5d] text-white px-6 py-3 rounded text-sm font-medium"
            >
              Buy it now
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-medium border ${
                isWishlisted ? "border-red-500 text-red-500" : "border-gray-800 text-gray-800"
              } hover:bg-gray-100`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart className={isWishlisted ? "text-red-500" : "text-gray-800"} />
              {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-8 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-screen-xl mx-auto px-4 mt-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Customer Reviews ({product.reviews?.length || 0})
        </h2>

        <div className="mb-6 text-yellow-500 text-lg">
          {product.rating
            ? "⭐".repeat(Math.round(product.rating)) +
              ` (${product.rating.toFixed(1)} avg)`
            : "No ratings yet"}
        </div>

        {product.reviews?.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 p-4 rounded-lg mb-4 bg-white">
              <div className="font-medium text-gray-700">{review.name}</div>
              <div className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</div>
              <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}

        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-2">Write a Review</h3>
            <label className="block mb-1 text-sm text-gray-600">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded px-3 py-2 mb-3 w-full"
              required
            >
              <option value="">Select...</option>
              <option value="1">⭐ - Poor</option>
              <option value="2">⭐⭐ - Fair</option>
              <option value="3">⭐⭐⭐ - Good</option>
              <option value="4">⭐⭐⭐⭐ - Very Good</option>
              <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
            </select>

            <label className="block mb-1 text-sm text-gray-600">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border rounded px-3 py-2 mb-3 w-full"
              rows="3"
              required
            />

            <button type="submit" className="bg-black text-white px-5 py-2 rounded-lg">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            Please{" "}
            <Link to="/login" className="text-blue-600 underline">
              login
            </Link>{" "}
            to write a review.
          </p>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;
