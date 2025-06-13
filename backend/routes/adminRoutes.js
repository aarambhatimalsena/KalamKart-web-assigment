import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

// 🛡️ Admin Auth and Stats
import {
  loginAdmin,
  getAdminStats
} from '../controllers/adminController.js';

// 🛍️ Product Controllers
import {
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

// 🗂️ Category Controllers
import {
  createCategory,
  bulkCreateCategories
} from '../controllers/categoryController.js';

// 🎟️ Coupon Controllers
import {
  createCoupon,
  deleteCoupon
} from '../controllers/couponController.js';

// 📦 Order Controllers (Admin Side)
import {
  getAllOrders,
  updateOrderStatus,
  markOrderPaid
} from '../controllers/orderController.js'; // ✅ Adjust path if needed

const router = express.Router();

// 🔐 Admin Login
router.post('/login', loginAdmin);

// 📊 Admin Dashboard Stats
router.get('/stats', protect, adminOnly, getAdminStats);

// 🛍️ Admin Product Management
router.post('/products', protect, adminOnly, createProduct);
router.put('/products/:id', protect, adminOnly, updateProduct);
router.delete('/products/:id', protect, adminOnly, deleteProduct);

// 🗂️ Admin Category Management
router.post('/categories', protect, adminOnly, createCategory);
router.post('/categories/bulk', protect, adminOnly, bulkCreateCategories);

// 🎟️ Admin Coupon Management
router.post('/coupons', protect, adminOnly, createCoupon);
router.delete('/coupons/:code', protect, adminOnly, deleteCoupon);

// 📦 Admin Order Management
router.get('/orders', protect, adminOnly, getAllOrders);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/orders/:id/pay', protect, adminOnly, markOrderPaid);

export default router;
