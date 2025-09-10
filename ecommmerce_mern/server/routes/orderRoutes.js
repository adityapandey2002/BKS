const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const { createOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/:id', getOrderById);

// Admin: update status/pay/deliver
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);

module.exports = router;
