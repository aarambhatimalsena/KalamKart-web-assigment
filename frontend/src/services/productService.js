import api from "../api/api";

// ✅ Get all products (with optional filters like search/category)
export const getAllProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

// ✅ Get a single product by ID
export const getProductById = async (productId) => {
  const res = await api.get(`/products/${productId}`);
  return res.data;
};

// ✅ Admin: Create a new product
export const createProduct = async (productData) => {
  const res = await api.post("/products/admin", productData);
  return res.data;
};

// ✅ Admin: Update a product
export const updateProduct = async (productId, updatedData) => {
  const res = await api.put(`/products/admin/${productId}`, updatedData);
  return res.data;
};

// ✅ Admin: Delete a product
export const deleteProduct = async (productId) => {
  const res = await api.delete(`/products/admin/${productId}`);
  return res.data;
};

// ✅ Add product review
export const createReview = async (productId, reviewData) => {
  const res = await api.post(`/reviews/${productId}`, reviewData);
  return res.data;
};

// ✅ Get top-rated products
export const getTopProducts = async () => {
  const res = await api.get("/products/top");
  return res.data;
};

// ✅ Get single product by slug (optional use)
export const getProductBySlug = async (slug) => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};

// ✅ ✅ ✅ FINAL FIX — correct category route
export const getProductsByCategory = async (categoryName) => {
  const res = await api.get(`/products/category/${encodeURIComponent(categoryName)}`);
  return res.data;
};
