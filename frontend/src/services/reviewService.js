// src/services/reviewService.js
import api from "../api/api";

// Admin: Get all reviews
export const getAllReviews = async () => {
  const res = await api.get("/admin/reviews");
  return res.data;
};

// Admin: Delete a review
export const deleteReviewByAdmin = async ({ productId, reviewId }) => {
  const res = await api.delete(`/reviews/${productId}/${reviewId}`);
  return res.data;
};
