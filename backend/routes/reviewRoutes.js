import express from 'express';
import {
  addReview,
  getProductReviews,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:productId', protect, addReview); // ✅ Add review
router.get('/:productId', getProductReviews);    // ✅ View reviews
router.delete('/:productId/:reviewId', protect, deleteReview); // ✅ Delete review

export default router;
