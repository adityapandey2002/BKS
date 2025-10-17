// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware - MUST come before routes
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

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
let authRoutes, productRoutes, cartRoutes, orderRoutes, paymentRoutes, blogRoutes, wishlistRoutes, siteAssetsRoutes, contactRoutes;

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
  console.error('⚠️  Payment routes not found - payment functionality disabled');
  console.log('   Create server/routes/paymentRoutes.js to enable payments');
}

try {
  blogRoutes = require('./routes/blogRoutes');
  console.log('✅ Blog routes loaded');
} catch (err) {
  console.error('❌ Error loading blog routes:', err.message);
}

try {
  wishlistRoutes = require('./routes/wishlistRoutes');
  console.log('✅ Wishlist routes loaded');
} catch (err) {
  console.error('❌ Error loading wishlist routes:', err.message);
}

try {
  siteAssetsRoutes = require('./routes/siteAssetsRoutes');
  console.log('✅ Site assets routes loaded');
} catch (err) {
  console.error('⚠️  Site assets routes not found - logo/slideshow disabled');
  console.log('   Create server/routes/siteAssetsRoutes.js to enable this feature');
}

try {
  contactRoutes = require('./routes/contactRoutes');
  console.log('✅ Contact routes loaded');
} catch (err) {
  console.error('⚠️  Contact routes not found - contact form disabled');
  console.log('   Create server/routes/contactRoutes.js to enable this feature');
}

// Mount routes
if (authRoutes) app.use('/api/auth', authRoutes);
if (productRoutes) app.use('/api/products', productRoutes);
if (cartRoutes) app.use('/api/cart', cartRoutes);
if (orderRoutes) app.use('/api/orders', orderRoutes);
if (paymentRoutes) app.use('/api/payment', paymentRoutes);
if (blogRoutes) app.use('/api/blogs', blogRoutes);
if (wishlistRoutes) app.use('/api/wishlists', wishlistRoutes);
if (siteAssetsRoutes) app.use('/api/site-assets', siteAssetsRoutes);
if (contactRoutes) app.use('/api/contacts', contactRoutes);

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
      'GET /api/blogs',
      'GET /api/site-assets',
      'POST /api/contacts/submit',
      'GET /api/wishlists (auth required)',
      'POST /api/payment/create-order (auth required)'
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
  console.log('='.repeat(50));
  console.log('\n📋 Loaded Routes:');
  if (authRoutes) console.log('  ✅ Auth: /api/auth/*');
  if (productRoutes) console.log('  ✅ Products: /api/products/*');
  if (cartRoutes) console.log('  ✅ Cart: /api/cart/*');
  if (orderRoutes) console.log('  ✅ Orders: /api/orders/*');
  if (paymentRoutes) console.log('  ✅ Payment: /api/payment/*');
  if (blogRoutes) console.log('  ✅ Blogs: /api/blogs/*');
  if (wishlistRoutes) console.log('  ✅ Wishlist: /api/wishlists/*');
  if (siteAssetsRoutes) console.log('  ✅ Site Assets: /api/site-assets/*');
  if (contactRoutes) console.log('  ✅ Contacts: /api/contacts/*');
  console.log('='.repeat(50) + '\n');
});
