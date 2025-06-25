import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    category: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Load categories + product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, product] = await Promise.all([
          getAllCategories(),
          getProductById(id),
        ]);
        setCategories(cats);
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          countInStock: product.stock || "", // ✅ match with backend
          category: product.category || "",
          image: product.image || "",
        });
        setImagePreview(product.image);
      } catch (err) {
        toast.error("Failed to load product or categories");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (imageFile) {
      data.set("image", imageFile); // replace old image if new one selected
    }

    try {
      await updateProduct(id, data);
      toast.success("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error("❌ Failed to update product");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (Rs)"
          value={form.price || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        />

        <input
          type="number"
          name="countInStock"
          placeholder="Stock Count"
          value={form.countInStock || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        />

        <select
          name="category"
          value={form.category || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={handleImageChange}
          className="w-full"
          accept="image/*"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="h-32 rounded object-cover mt-2"
          />
        )}

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
