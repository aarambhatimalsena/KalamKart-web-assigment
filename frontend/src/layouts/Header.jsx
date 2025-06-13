// src/layouts/Header.jsx
import React from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { MdOutlineLightbulb } from "react-icons/md";
import { useNavigate, NavLink, Link } from "react-router-dom";
import useAuth from "../auth/useAuth";
import LogoutButton from "../pages/LogoutButton"; 
import logo from "../assets/KalamKart-logo.png";

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full font-inter text-gray-800">
      {/* 🔹 Top Strip */}
      <div className="flex justify-between items-center text-sm px-8 py-2 bg-white border-b border-gray-200">
        <span>Call: (+977) 9845986352</span>
        <span>
          Summer Sale{" "}
          <span className="text-pink-500 font-semibold">50% Off</span>
        </span>
        <div className="flex gap-4">
          <span className="cursor-pointer">NPR ▼</span>
          <span className="cursor-pointer">Find A Store</span>
        </div>
      </div>

      {/* 🔹 Logo + Search + Icons */}
      <div className="flex flex-wrap items-center justify-between px-8 py-6 bg-gray-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="KalamKart"
            className="w-14 h-14 object-contain"
          />
          <span className="text-3xl font-bold text-gray-900">
            KalamKart
          </span>
        </div>

        {/* Search */}
        <div className="flex items-stretch w-full md:max-w-3xl mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow px-4 py-3 rounded-l-full border border-gray-300 bg-white text-sm focus:outline-none"
          />
          <select className="border-y border-gray-300 px-4 text-sm bg-white">
            <option>All Categories</option>
            <option>Pens</option>
            <option>Notebooks</option>
            <option>Office</option>
          </select>
          <button className="bg-red-400 px-5 rounded-r-full flex items-center justify-center">
            <FaSearch className="text-white" />
          </button>
        </div>

        {/* User + Icons */}
        <div className="flex items-center gap-6 text-sm mt-4 md:mt-0 relative">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 font-medium">
              <div className="flex items-center gap-1 cursor-default">
                <FiUser className="text-lg" />
                <span>
                  {user?.name || user?.email || "My Account"}
                </span>
              </div>
              <LogoutButton /> {/* ✅ using shared button */}
            </div>
          ) : (
            <div className="flex items-center gap-4 font-medium">
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-yellow-500 cursor-pointer"
              >
                <FiUser className="text-lg" />
                SIGN IN
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 hover:text-yellow-500 cursor-pointer"
              >
                <FiUser className="text-lg" />
                REGISTER
              </Link>
            </div>
          )}

          <Link to="/wishlist" className="relative">
            <FaHeart className="text-lg cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
              0
            </span>
          </Link>

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-lg cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* 🔹 Browse + Nav */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-t border-b border-gray-100">
        <div className="flex items-center gap-2 text-base font-semibold">
          <FaBars className="text-xl" />
          <span>Browse Categories</span>
        </div>
        <ul className="flex gap-10 text-base font-medium">
          <li>
            <NavLink to="/" className="hover:text-yellow-500">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" className="hover:text-yellow-500">
              Shop ▼
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="hover:text-yellow-500">
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/pages" className="hover:text-yellow-500">
              Pages
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="hover:text-yellow-500">
              Contact
            </NavLink>
          </li>
        </ul>
        <div className="flex items-center text-base text-gray-700 font-medium">
          <MdOutlineLightbulb className="mr-2 text-xl text-yellow-400" />
          <span>
            <span className="text-gray-900">Clearance</span> Up{" "}
            <span className="text-pink-500">To 30% Off</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
