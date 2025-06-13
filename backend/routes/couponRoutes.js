import express from 'express';
import { createCoupon, getCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Only admins can create/delete, but anyone can validate a coupon
router.post('/', protect, adminOnly, createCoupon);
router.get('/:code', getCoupon);
router.delete('/:code', protect, adminOnly, deleteCoupon);

export default router;
