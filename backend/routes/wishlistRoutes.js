import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addToWishlist); // Add multiple products
router.get('/', protect, getWishlist);    // View all wishlist items
router.delete('/:productId', protect, removeFromWishlist); // Remove specific item

export default router;
