// src/pages/admin/EditCategory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCategories, updateCategory } from "../../services/categoryService";
import toast from "react-hot-toast";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await getAllCategories();
        const category = categories.find((cat) => cat._id === id);
        if (!category) return toast.error("Category not found");

        setName(category.name);
        setPreview(category.image);
      } catch (err) {
        toast.error("Failed to load category");
      }
    };

    fetchCategory();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      return toast.error("Name is required");
    }

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);
      await updateCategory(id, formData);
      toast.success("Category updated successfully!");
      navigate("/admin/categories");
    } catch (err) {
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-xl mx-auto p-6 rounded-xl shadow-sm animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-auto object-cover rounded mt-2"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
