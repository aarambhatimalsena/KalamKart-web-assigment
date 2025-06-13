import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById, // ✅ Import this
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; // ✅ Cloudinary upload middleware

const router = express.Router();

// 🟢 Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById); // ✅ Add this route!

// 🔒 Admin-only routes
router.post('/admin', protect, adminOnly, upload.single('image'), createProduct);
router.put('/admin/:id', protect, adminOnly, updateProduct);
router.delete('/admin/:id', protect, adminOnly, deleteProduct);

export default router;
