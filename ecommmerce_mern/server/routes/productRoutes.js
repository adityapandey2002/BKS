const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, restrictTo } = require('../controllers/authController');
const upload = require('../config/multer');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes (protected)
router.post('/', protect, restrictTo('admin'), upload.single('image'), createProduct);
router.patch('/:id', protect, restrictTo('admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

console.log('✅ Product routes loaded');

module.exports = router;
