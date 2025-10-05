const express = require('express');
const {
  getAllBlogs,
  getBlogById,
  getBlogImage,
  createBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, restrictTo } = require('../controllers/authController');
const upload = require('../config/multer');

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.get('/:id/image', getBlogImage); // Serve image as binary

// Admin routes
router.post('/', protect, restrictTo('admin'), upload.single('image'), createBlog);
router.delete('/:id', protect, restrictTo('admin'), deleteBlog);

module.exports = router;
