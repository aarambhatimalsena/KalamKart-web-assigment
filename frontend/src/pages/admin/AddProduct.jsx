import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import toast from "react-hot-toast";

const AddProduct = () => {
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await createProduct(formData);
      toast.success("✅ Product added!");
      navigate("/admin/products");
    } catch {
      toast.error("❌ Failed to add product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Parker Gel Pen"
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter detailed product description..."
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (Rs)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Count</label>
              <input
                type="number"
                name="countInStock"
                value={form.countInStock}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border rounded-md px-4 py-2"
              accept="image/*"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-36 w-auto rounded-md border object-cover"
              />
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
