const express = require('express');
const { signup, login, logout, protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);

// Example protected route to fetch current user
router.get('/me', protect, (req, res) => {
  res.status(200).json({ status: 'success', user: req.user });
});

// Example admin-only route (health check/admin info)
router.get('/admin-check', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({ status: 'success', message: 'Admin OK' });
});

module.exports = router;
