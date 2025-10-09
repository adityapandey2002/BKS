const express = require('express');
const {
  getSiteAssets,
  uploadLogo,
  addSlideshow,
  deleteSlideshow,
  updateSiteSettings
} = require('../controllers/siteAssetsController');
const { protect, restrictTo } = require('../controllers/authController');
const upload = require('../config/multer');

const router = express.Router();

// Public route
router.get('/', getSiteAssets);

// Admin routes
router.post('/logo', protect, restrictTo('admin'), upload.single('logo'), uploadLogo);
router.post('/slideshow', protect, restrictTo('admin'), upload.single('image'), addSlideshow);
router.delete('/slideshow/:slideId', protect, restrictTo('admin'), deleteSlideshow);
router.patch('/settings', protect, restrictTo('admin'), updateSiteSettings);

console.log('✅ Site assets routes loaded');

module.exports = router;
