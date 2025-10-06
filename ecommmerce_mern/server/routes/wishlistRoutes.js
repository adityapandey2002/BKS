const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistItem
} = require('../controllers/wishlistController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/clear', clearWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlistItem);

console.log('✅ Wishlist routes loaded');

module.exports = router;
