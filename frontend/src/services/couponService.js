import api from "../api/api";

// Get all coupons (admin)
export const getAllCoupons = async () => {
  const res = await api.get("/admin/coupons");
  return res.data;
};

// Create a new coupon (admin)
export const createCoupon = async (couponData) => {
  const res = await api.post("/admin/coupons", couponData);
  return res.data;
};

// Delete coupon by code (admin)
export const deleteCoupon = async (code) => {
  const res = await api.delete(`/admin/coupons/${code}`);
  return res.data;
};
