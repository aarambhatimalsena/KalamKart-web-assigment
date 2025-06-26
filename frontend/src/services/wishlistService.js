import api from "../api/api";

const WISHLIST_KEY = "kalamkart_wishlist";

// ✅ Guest: Get wishlist from localStorage
export const getWishlist = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(p => p && p._id) : [];
  } catch {
    return [];
  }
};

// ✅ Guest: Add item
export const addToWishlistGuest = (product) => {
  const current = getWishlist();
  if (!current.find((p) => p._id === product._id)) {
    const updated = [...current, product];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("update-wishlist-count"));
  }
};

// ✅ Guest: Remove item
export const removeFromWishlistGuest = (productId) => {
  const updated = getWishlist().filter(p => p._id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("update-wishlist-count"));
};

// ✅ ✅ FINAL FIXED: Logged-in user or fallback to guest
export const getWishlistItems = async () => {
  const token = localStorage.getItem("token");

  // ✅ Guest fallback — no request to backend
  if (!token) {
    return getWishlist();
  }

  try {
    const res = await api.get("/wishlist");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("❌ Wishlist fetch failed", error?.response?.status);
    return [];
  }
};

// ✅ Logged-in user: Add items
export const addToWishlist = async (productIds) => {
  const res = await api.post("/wishlist", { productIds });
  return res.data;
};

// ✅ Logged-in user: Remove item
export const removeFromWishlist = async (productId) => {
  const res = await api.delete(`/wishlist/${productId}`);
  return res.data;
};
