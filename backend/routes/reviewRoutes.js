import express from 'express';
import {
  addReview,
  getProductReviews,
  deleteReview,
  getAllReviews, 
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Review Endpoints
router.post('/:productId', protect, addReview);                     // Add review
router.get('/:productId', getProductReviews);                       // View reviews for a product
router.delete('/:productId/:reviewId', protect, deleteReview);      // Delete review (self or admin)

// Admin: Get all reviews across all products
router.get('/', protect, adminOnly, getAllReviews);                // View all reviews (admin only)

export default router;
