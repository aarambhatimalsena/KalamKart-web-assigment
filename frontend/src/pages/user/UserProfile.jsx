import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from "../../services/userService";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setFormData({ name: data.name, email: data.email, password: "" });
        updateUser(data);
      } catch (err) {
        toast.error("❌ Failed to load profile");
      }
    };
    fetchProfile();
  }, [updateUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const imgForm = new FormData();
    imgForm.append("image", file);

    try {
      const result = await uploadProfileImage(imgForm);
      updateUser({ ...user, profileImage: result.profileImage });

      // Update Header instantly
      window.dispatchEvent(new Event("update-profile"));

      toast.success("✅ Profile image updated!");
    } catch (err) {
      toast.error("❌ Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Skip password if blank
      const payload = { ...formData };
      if (!formData.password) delete payload.password;

      const updatedUser = await updateUserProfile(payload);
      updateUser(updatedUser);

      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🧭 Breadcrumb */}
      <div className="bg-[#f5f1eb] py-4 px-6 text-sm text-gray-700">
        <div className="max-w-5xl mx-auto flex justify-center items-center gap-2">
          <FiHome className="inline-block w-4 h-4" />
          <Link to="/" className="hover:underline">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">My Profile</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-pink-500 mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* 📸 Profile image */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={previewImage || user?.profileImage || "/default-avatar.png"}

              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border-2 border-pink-400 shadow-sm"
            />
            <label className="cursor-pointer bg-pink-100 text-pink-600 font-medium px-4 py-2 rounded hover:bg-pink-200 transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* ✏️ Profile form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-pink-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-pink-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block font-medium text-gray-700 mb-1">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full p-3 border rounded-md shadow-sm pr-10 focus:outline-pink-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[40px] right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Leave blank to keep current password
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
