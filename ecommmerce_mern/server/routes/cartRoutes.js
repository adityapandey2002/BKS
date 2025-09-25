const express = require('express');
const { protect } = require('../controllers/authController');
const { getCart, addToCart, updateItemQuantity, removeItem, clearCart } = require('../controllers/cartController');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/item', updateItemQuantity);
router.delete('/item/:productId', removeItem);
router.delete('/', clearCart);

module.exports = router;
