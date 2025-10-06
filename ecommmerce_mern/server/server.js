// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Add with other route imports
const wishlistRoutes = require('./routes/wishlistRoutes');




const app = express();

// Middleware - MUST come before routes
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Mount routes
app.use('/api/wishlists', wishlistRoutes);  // Add this line

// Test route - to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date() });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected to:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Import routes - with error handling
let authRoutes, productRoutes, cartRoutes, orderRoutes, paymentRoutes, blogRoutes;

try {
  authRoutes = require('./routes/authRoutes');
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Error loading auth routes:', err.message);
}

try {
  productRoutes = require('./routes/productRoutes');
  console.log('✅ Product routes loaded');
} catch (err) {
  console.error('❌ Error loading product routes:', err.message);
}

try {
  cartRoutes = require('./routes/cartRoutes');
  console.log('✅ Cart routes loaded');
} catch (err) {
  console.error('❌ Error loading cart routes:', err.message);
}

try {
  orderRoutes = require('./routes/orderRoutes');
  console.log('✅ Order routes loaded');
} catch (err) {
  console.error('❌ Error loading order routes:', err.message);
}

try {
  paymentRoutes = require('./routes/paymentRoutes');
  console.log('✅ Payment routes loaded');
} catch (err) {
  console.error('❌ Error loading payment routes:', err.message);
}

try {
  blogRoutes = require('./routes/blogRoutes');
  console.log('✅ Blog routes loaded');
} catch (err) {
  console.error('❌ Error loading blog routes:', err.message);
}

// Mount routes
if (authRoutes) app.use('/api/auth', authRoutes);
if (productRoutes) app.use('/api/products', productRoutes);
if (cartRoutes) app.use('/api/cart', cartRoutes);
if (orderRoutes) app.use('/api/orders', orderRoutes);
if (paymentRoutes) app.use('/api/payment', paymentRoutes);
if (blogRoutes) app.use('/api/blogs', blogRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.url);
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: [
      'GET /api/test',
      'POST /api/auth/login',
      'POST /api/auth/signup',
      'GET /api/products',
      'GET /api/blogs'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log('='.repeat(50) + '\n');
});
