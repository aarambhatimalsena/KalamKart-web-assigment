import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/categoryService";
import toast from "react-hot-toast";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !imageFile) {
      return toast.error("Name and image are required");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile);

    try {
      setLoading(true);
      await createCategory(formData);
      toast.success("Category created successfully!");
      navigate("/admin/categories");
    } catch (err) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-32 rounded object-cover mt-2"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
