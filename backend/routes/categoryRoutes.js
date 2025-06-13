import express from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController.js';
const router = express.Router();

// GET all categories
router.get('/', getAllCategories);

// POST a new category
router.post('/', createCategory);

export default router;
