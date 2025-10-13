const express = require('express');
const {
  createOrder,
  verifyPayment,
  getOrder,
  getUserOrders
} = require('../controllers/paymentController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/orders', getUserOrders);
router.get('/orders/:id', getOrder);

console.log('✅ Payment routes loaded');

module.exports = router;
