import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaClock, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#062a44] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo + Tagline */}
        <div>
          <h2 className="text-2xl font-bold mb-3">
            <span className="text-[#e63946]">K</span>alamKart
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            We promise we’ll get back to you promptly — <br />
            Your gifting needs are always on our minds!
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold mb-4 text-sm">USEFUL LINKS</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/delivery-policy" className="hover:underline">Delivery Policy</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ’s</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/return-policy" className="hover:underline">Return Policy</Link></li>
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-semibold mb-4 text-sm">SHOP</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/products" className="hover:underline">Shop</Link></li>
            <li><Link to="/blog" className="hover:underline">Blog News</Link></li>
            <li><Link to="/new-arrivals" className="hover:underline">New Arrivals</Link></li>
            <li><Link to="/sitemap" className="hover:underline">Keywords Sitemap</Link></li>
            <li><Link to="/best-sellers" className="hover:underline">Best Selling Products</Link></li>
          </ul>
        </div>

        {/* Need Help */}
        <div>
          <h3 className="font-semibold mb-4 text-sm">NEED HELP</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-pink-500" />
              <span className="text-pink-400 font-semibold">(+977)-9845986352</span>
            </li>
            <li className="flex items-center gap-2">
              <FaClock />
              Sunday – Friday: 9:00–20:00
            </li>
            <li className="flex items-center gap-2">
              <FaClock />
              Saturday: 11:00 – 15:00
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope />
              support@kalamkart.com
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
