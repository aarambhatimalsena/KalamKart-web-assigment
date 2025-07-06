import React, { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiHome } from "react-icons/fi";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import {
  addToWishlist as addToWishlistBackend,
  removeFromWishlist as removeFromWishlistBackend,
  getWishlistItems,
} from "../services/wishlistService";
import { addToCart } from "../services/cartService";
import { useAuth } from "../auth/AuthProvider";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("az");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  const keyword = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts({ search: keyword, category });
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        toast.error("❌ Failed to load products");
      }
    };
    fetchData();
  }, [keyword, category]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setWishlistItems([]);
      return;
    }

    const loadWishlist = async () => {
      const items = await getWishlistItems();
      setWishlistItems(items.map((item) => item.product?._id || item._id));
    };

    loadWishlist();

    const handleWishlistUpdate = () => loadWishlist();
    window.addEventListener("update-wishlist-count", handleWishlistUpdate);
    return () => {
      window.removeEventListener("update-wishlist-count", handleWishlistUpdate);
    };
  }, [user, loading]);

  const handleWishlistClick = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast("🚫 Please login to manage wishlist", {
        icon: "❌",
        style: {
          border: "1px solid #f87171",
          padding: "12px",
          color: "#991b1b",
          background: "#fee2e2",
        },
      });
      return;
    }

    try {
      if (wishlistItems.includes(product._id)) {
        await removeFromWishlistBackend(product._id);
        toast("❌ Removed from wishlist");
      } else {
        await addToWishlistBackend([product._id]);
        toast.success("✅ Added to wishlist");
      }

      const updated = await getWishlistItems();
      setWishlistItems(updated.map((item) => item.product?._id || item._id));
      window.dispatchEvent(new Event("update-wishlist-count"));
    } catch {
      toast.error("❌ Something went wrong");
    }
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast("🚫 Please login to add to cart", {
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
      await addToCart(product._id, 1);
      toast.success("✅ Added to cart!");
      window.dispatchEvent(new Event("update-cart-count"));
      navigate("/cart");
    } catch (err) {
      toast.error("❌ Failed to add to cart");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "az") return a.name.localeCompare(b.name);
    if (sort === "za") return b.name.localeCompare(a.name);
    if (sort === "price") return a.price - b.price;
    if (sort === "priceDesc") return b.price - a.price;
    return 0;
  });

  const productsPerPage = 10;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = viewAll
    ? sortedProducts
    : sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      );

  return (
    <>
      <div className="bg-[#f5f1eb] py-4 px-6 text-sm text-gray-700">
        <div className="max-w-5xl mx-auto flex justify-center items-center gap-2">
          <FiHome className="inline-block w-4 h-4" />
          <Link to="/" className="underline hover:text-gray-800">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">Products</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Products</h2>
          <div className="flex items-center gap-4 text-sm">
            <label htmlFor="sort" className="text-gray-600">
              Sort by:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 px-3 py-1 rounded text-sm"
            >
              <option value="az">Alphabetically, A–Z</option>
              <option value="za">Alphabetically, Z–A</option>
              <option value="price">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
            <span className="text-gray-500">{sortedProducts.length} products</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => {
            const isWishlisted = wishlistItems.includes(product._id);
            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group bg-white border border-gray-300 rounded-xl overflow-hidden shadow hover:shadow-lg transition relative"
              >
                <div className="relative w-full h-[250px] bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Icons appear only on hover */}
                  <div className="absolute top-2 right-2 flex gap-2 bg-white/90 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWishlistClick(e, product);
                      }}
                      className="text-gray-600 hover:text-red-500"
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FaHeart className={isWishlisted ? "text-red-500" : "text-gray-400"} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(e, product);
                      }}
                      className="text-gray-600 hover:text-yellow-500"
                      title="Add to cart"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-base font-semibold text-gray-900 mb-1 truncate">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-700 font-medium">
                    Rs. {product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {!viewAll && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === idx + 1 ? "font-bold underline" : "hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}

        {sortedProducts.length > productsPerPage && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setViewAll(!viewAll)}
              className="text-sm text-blue-600 hover:underline"
            >
              {viewAll ? "Show Paginated View" : "View All Products"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductListPage;
