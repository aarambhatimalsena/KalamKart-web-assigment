import api from "../api/api";

// USER: Order-related APIs


// Place a new order (user)
export const placeOrder = async (orderData) => {
  const res = await api.post("/orders/place", orderData); // ← add /place
  return res.data;
};

// Get logged-in user's orders
export const getUserOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
};

// Download invoice for an order
export const downloadInvoice = async (orderId) => {
  const res = await api.get(`/orders/invoice/${orderId}`, {
    responseType: "blob", // important for downloading PDF
  });
  return res;
};


// ADMIN: Order Management APIs


// Get all orders (admin)
export const getAllOrders = async () => {
  const res = await api.get("/orders/admin/all");
  return res.data;
};

// Get a single order by ID
export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

// Update order status (admin)
export const updateOrderStatus = async ({ orderId, status }) => {
  const res = await api.put("/orders/admin/status", { orderId, status });
  return res.data;
};

// Mark order as paid (admin)
export const markOrderPaid = async ({ orderId }) => {
  const res = await api.put("/orders/admin/mark-paid", { orderId });
  return res.data;
};
