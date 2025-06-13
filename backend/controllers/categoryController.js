import Category from '../models/Category.js';

// ✅ GET all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// ✅ POST a new category
export const createCategory = async (req, res) => {
  const { name, image } = req.body;
  try {
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name, image });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// ✅ BULK: Create multiple categories
export const bulkCreateCategories = async (req, res) => {
  const categories = req.body.categories;

  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ message: 'No categories provided' });
  }

  try {
    const results = await Category.insertMany(categories, { ordered: false }); // continue on duplicates
    res.status(201).json({
      message: `${results.length} categories added successfully.`,
      categories: results
    });
  } catch (error) {
    res.status(500).json({
      message: 'Bulk category creation failed for some entries',
      error: error.message
    });
  }
};
