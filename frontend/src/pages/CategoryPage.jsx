import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory } from "../services/productService";
import { addToCart } from "../services/cartService";
import { addToWishlist as addToWishlistBackend } from "../services/wishlistService";
import { useAuth } from "../auth/AuthProvider";
import toast from "react-hot-toast";
import { FiHome } from "react-icons/fi";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(categoryName);
        setProducts(data);
      } catch (err) {
        toast.error("❌ Failed to load category products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [categoryName]);

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) return toast.error("Login to add to wishlist!");
    try {
      await addToWishlistBackend([productId]);
      toast.success("❤️ Added to wishlist");
      window.dispatchEvent(new Event("update-wishlist-count"));
    } catch {
      toast.error("Failed to wishlist");
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) return toast.error("Login to add to cart!");
    try {
      await addToCart(productId);
      toast.success("🛒 Added to cart");
      window.dispatchEvent(new Event("update-cart-count"));
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <>
      {/* ✅ Breadcrumb */}
      <div className="bg-[#F9F3F0] py-4 mb-4">
        <div className="max-w-screen-xl mx-auto flex justify-center px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiHome />
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-black font-medium capitalize">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <h2 className="text-2xl font-semibold mb-4 capitalize">{categoryName}</h2>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group border rounded-lg p-4 bg-white hover:shadow-md transition relative"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-3 transition-opacity group-hover:opacity-40"
                  />
                </Link>

                {/* Hover Icons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden group-hover:flex gap-4 text-gray-700">
                  <button onClick={() => handleAddToWishlist(product._id)}>
                    <FaHeart className="text-xl hover:text-pink-500" />
                  </button>
                  <button onClick={() => handleAddToCart(product._id)}>
                    <FaShoppingCart className="text-xl hover:text-green-600" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {product.name}
                </h4>
                <p className="text-gray-700 text-sm">Rs. {product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
