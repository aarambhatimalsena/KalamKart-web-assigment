import React, { useEffect, useRef, useState } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { MdOutlineLightbulb } from "react-icons/md";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getAllCategories } from "../services/categoryService";
import { getWishlistItems } from "../services/wishlistService";
import { getCart } from "../services/cartService";
import LogoutButton from "../pages/LogoutButton";
import logo from "../assets/KalamKart-logo.png";
import useSearchProducts from "../hooks/useSearchProducts";

const Header = () => {
  const { user, isAuthenticated, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);

  const { results: suggestions, loading: loadingSuggestions } = useSearchProducts(search);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (loading) return;

    const fetchWishlistCount = async () => {
      try {
        if (isAuthenticated) {
          const items = await getWishlistItems();
          setWishlistCount(items.length);
        } else {
          const raw = localStorage.getItem("kalamkart_wishlist");
          const guestWishlist = raw ? JSON.parse(raw) : [];
          const validItems = Array.isArray(guestWishlist)
            ? guestWishlist.filter((p) => p && p._id)
            : [];
          setWishlistCount(validItems.length);
        }
      } catch {
        setWishlistCount(0);
      }
    };

    const fetchCartCount = async () => {
      try {
        if (isAuthenticated) {
          const cart = await getCart();
          setCartCount(cart.items.length);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    fetchWishlistCount();
    fetchCartCount();

    window.addEventListener("update-wishlist-count", fetchWishlistCount);
    window.addEventListener("update-cart-count", fetchCartCount);

    return () => {
      window.removeEventListener("update-wishlist-count", fetchWishlistCount);
      window.removeEventListener("update-cart-count", fetchCartCount);
    };
  }, [isAuthenticated, loading]);

  useEffect(() => {
    const handleProfileUpdate = async () => {
      try {
        const { getUserProfile } = await import("../services/userService");
        const fullProfile = await getUserProfile();
        setUser(fullProfile);
      } catch {
        window.location.reload();
      }
    };
    window.addEventListener("update-profile", handleProfileUpdate);
    return () => window.removeEventListener("update-profile", handleProfileUpdate);
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".search-autocomplete")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const categoryParam = selectedCategory !== "All Categories"
        ? `&category=${encodeURIComponent(selectedCategory)}`
        : "";
      navigate(`/products?search=${encodeURIComponent(search.trim())}${categoryParam}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="w-full font-inter text-gray-800">
      {/* Top Strip */}
      <div className="flex justify-between items-center text-sm px-8 py-2 bg-white border-b border-gray-200">
        <span>Call: (+977) 9845986352</span>
        <span>Summer Sale <span className="text-pink-500 font-semibold">50% Off</span></span>
        <div className="flex gap-4">
          <span className="cursor-pointer">NPR ▼</span>
          <span className="cursor-pointer">Find A Store</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex flex-wrap items-center justify-between px-8 py-6 bg-gray-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="KalamKart" className="w-14 h-14 object-contain" />
          <span className="text-3xl font-bold text-gray-900">KalamKart</span>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-3xl search-autocomplete">
          <form onSubmit={handleSearchSubmit} className="flex items-stretch">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for products..."
              className="flex-grow px-4 py-3 rounded-l-full border border-gray-300 bg-white text-sm focus:outline-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-y border-gray-300 px-4 text-sm bg-white"
            >
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id}>{cat.name}</option>
              ))}
            </select>
            <button type="submit" className="bg-red-400 px-5 rounded-r-full flex items-center justify-center">
              <FaSearch className="text-white" />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && search && (
            <div className="absolute top-full mt-1 w-full max-h-[300px] overflow-y-auto bg-white shadow-xl rounded z-50 border border-gray-100">
              {loadingSuggestions ? (
                <div className="p-4 text-gray-500 text-sm">Loading...</div>
              ) : suggestions.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">No results found</div>
              ) : (
                suggestions.slice(0, 10).map((product) => (
                  <Link
                    key={product._id}
                    to={`/products?search=${encodeURIComponent(product.name)}`}
                    className="flex items-center gap-3 px-4 py-2 border-b hover:bg-gray-50 transition"
                    onClick={() => {
                      setSearch("");
                      setShowSuggestions(false);
                    }}
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded border" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-800">{product.name}</span>
                      <span className="text-xs text-gray-500">NPR {product.price}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-sm mt-4 md:mt-0 relative">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full border object-cover" />
                ) : (
                  <FiUser className="text-xl" />
                )}
                <span>{user?.name?.split(" ")[0]}</span>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg border border-gray-200 z-50 font-medium text-gray-700">
                  <Link to="/profile" className="block px-4 py-3 hover:bg-gray-100">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-3 hover:bg-gray-100">View Orders</Link>
                  <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer"><LogoutButton /></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 font-medium">
              <Link to="/login" className="flex items-center gap-1 hover:text-yellow-500">
                <FiUser className="text-lg" /> SIGN IN
              </Link>
              <Link to="/register" className="flex items-center gap-1 hover:text-yellow-500">
                <FiUser className="text-lg" /> REGISTER
              </Link>
            </div>
          )}

          <Link to="/wishlist" className="relative">
            <FaHeart className="text-lg" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Browse Categories Nav */}
      <div className="relative border-t border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
              className="flex items-center gap-2 text-base font-semibold"
            >
              <FaBars className="text-xl" />
              <span>Browse Categories</span>
            </button>

            {showCategoryDropdown && (
              <div className="absolute z-50 bg-white shadow-lg mt-2 w-60 rounded border border-gray-100">
                {categories.map((cat, idx) => (
                  <div
                    key={cat._id}
                    onMouseDown={() => {
                      navigate(`/category/${encodeURIComponent(cat.name)}`);
                      setShowCategoryDropdown(false);
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border-b hover:text-red-500 cursor-pointer"
                  >
                    <span className="text-lg">{categoryIcon(idx)}</span>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ul className="flex gap-10 text-base font-medium">
            <li><NavLink to="/" className="hover:text-yellow-500">Home</NavLink></li>
            <li><NavLink to="/products" className="hover:text-yellow-500">Products</NavLink></li>
            <li><NavLink to="/pages" className="hover:text-yellow-500">Pages</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-yellow-500">Contact</NavLink></li>
          </ul>

          <div className="flex items-center text-base text-gray-700 font-medium">
            <MdOutlineLightbulb className="mr-2 text-xl text-yellow-400" />
            <span><span className="text-gray-900">Clearance</span> Up <span className="text-pink-500">To 30% Off</span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

const categoryIcon = (i) => {
  const icons = ["📚", "✒️", "🖊️", "🧮", "📏", "🧷", "📌", "📎", "📂", "📒", "📝"];
  return icons[i % icons.length];
};

export default Header;
