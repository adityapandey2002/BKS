const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    console.log('📥 Fetching wishlist for user:', req.user._id);
    
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: 'name description price category stock image'
      });

    // Create wishlist if doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Convert product images to base64
    const wishlistData = wishlist.toObject();
    wishlistData.products = wishlistData.products.map(item => {
      if (item.product && item.product.image && item.product.image.data) {
        item.product.imageUrl = `data:${item.product.image.contentType};base64,${item.product.image.data.toString('base64')}`;
        delete item.product.image;
      }
      return item;
    });

    console.log(`✅ Wishlist sent with ${wishlistData.products.length} items`);
    res.status(200).json({ status: 'success', data: wishlistData });
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Product ID is required' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Product not found' 
      });
    }

    console.log(`➕ Adding product ${productId} to wishlist for user ${req.user._id}`);

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ 
        user: req.user._id, 
        products: [{ product: productId }] 
      });
    } else {
      // Check if product already in wishlist
      const existingProduct = wishlist.products.find(
        item => item.product.toString() === productId
      );

      if (existingProduct) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Product already in wishlist' 
        });
      }

      // Add product to wishlist
      wishlist.products.push({ product: productId });
      await wishlist.save();
    }

    // Populate and return updated wishlist
    wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: 'name description price category stock image'
      });

    // Convert images
    const wishlistData = wishlist.toObject();
    wishlistData.products = wishlistData.products.map(item => {
      if (item.product && item.product.image && item.product.image.data) {
        item.product.imageUrl = `data:${item.product.image.contentType};base64,${item.product.image.data.toString('base64')}`;
        delete item.product.image;
      }
      return item;
    });

    console.log('✅ Product added to wishlist');
    res.status(200).json({ 
      status: 'success', 
      message: 'Product added to wishlist',
      data: wishlistData 
    });
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log(`➖ Removing product ${productId} from wishlist for user ${req.user._id}`);

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Wishlist not found' 
      });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();

    // Populate and return updated wishlist
    const updatedWishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: 'name description price category stock image'
      });

    // Convert images
    const wishlistData = updatedWishlist.toObject();
    wishlistData.products = wishlistData.products.map(item => {
      if (item.product && item.product.image && item.product.image.data) {
        item.product.imageUrl = `data:${item.product.image.contentType};base64,${item.product.image.data.toString('base64')}`;
        delete item.product.image;
      }
      return item;
    });

    console.log('✅ Product removed from wishlist');
    res.status(200).json({ 
      status: 'success', 
      message: 'Product removed from wishlist',
      data: wishlistData 
    });
  } catch (error) {
    console.error('❌ Error removing from wishlist:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Clear entire wishlist
exports.clearWishlist = async (req, res) => {
  try {
    console.log(`🗑️ Clearing wishlist for user ${req.user._id}`);

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Wishlist not found' 
      });
    }

    wishlist.products = [];
    await wishlist.save();

    console.log('✅ Wishlist cleared');
    res.status(200).json({ 
      status: 'success', 
      message: 'Wishlist cleared',
      data: wishlist 
    });
  } catch (error) {
    console.error('❌ Error clearing wishlist:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Check if product is in wishlist
exports.checkWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(200).json({ 
        status: 'success', 
        inWishlist: false 
      });
    }

    const inWishlist = wishlist.products.some(
      item => item.product.toString() === productId
    );

    res.status(200).json({ 
      status: 'success', 
      inWishlist 
    });
  } catch (error) {
    console.error('❌ Error checking wishlist:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
 