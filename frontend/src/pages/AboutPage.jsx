import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import aboutImage from "../assets/aboutus.png"; // adjust if your image path is different

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#f5f1eb] py-6 px-4 text-sm text-gray-700">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-2">
          <FiHome className="inline-block w-4 h-4 text-gray-700" />
          <Link to="/" className="text-gray-900 underline font-light">
            Home
          </Link>
          <span className="text-gray-400">›</span>
          <span className="font-medium text-gray-900">About</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="w-full">
            <img
              src={aboutImage}
              alt="About KalamKart"
              className="rounded-xl w-full h-[420px] object-cover shadow"
            />
          </div>

          {/* Text aligned with image top */}
          <div className="flex flex-col justify-start text-gray-800">
            <h2 className="text-4xl font-semibold mb-4">Our Story</h2>
            <p className="text-base leading-relaxed mb-4">
              KalamKart is your trusted stationery eCommerce destination from
              essential office tools to artistic inspiration. We deliver
              top quality notebooks, pens, planners, and supplies directly to
              your door.
            </p>
            <p className="text-base leading-relaxed mb-4">
              Whether you're a student, a creative, or a professional, we’re
              here to support your daily journey with products that empower
              focus, imagination, and productivity.
            </p>
            <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-gray-600">
              “ Empowering productivity and creativity — one pen at a time. ”
            </blockquote>
            <div className="mt-4 font-semibold text-gray-800">
              — KalamKart Team (Aarambha Timalsena)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
