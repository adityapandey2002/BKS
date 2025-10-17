const express = require('express');
const router = express.Router();

// Temporary payment routes
router.post('/create-order', (req, res) => {
  res.status(503).json({
    status: 'error',
    message: 'Payment system is being configured. Please check back soon.'
  });
});

router.post('/verify-payment', (req, res) => {
  res.status(503).json({
    status: 'error',
    message: 'Payment system is being configured. Please check back soon.'
  });
});

module.exports = router;
