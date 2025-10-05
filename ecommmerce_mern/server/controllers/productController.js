const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    const filter = { published: true };

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Convert image buffer to base64
    const productsWithImages = products.map(product => {
      const productObj = product.toObject();
      if (productObj.image && productObj.image.data) {
        productObj.imageUrl = `data:${productObj.image.contentType};base64,${productObj.image.data.toString('base64')}`;
        delete productObj.image;
      }
      return productObj;
    });

    console.log(`✅ Sending ${productsWithImages.length} products`);
    res.status(200).json({ status: 'success', data: productsWithImages });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.published) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    const productObj = product.toObject();
    if (productObj.image && productObj.image.data) {
      productObj.imageUrl = `data:${productObj.image.contentType};base64,${productObj.image.data.toString('base64')}`;
      delete productObj.image;
    }

    res.status(200).json({ status: 'success', data: productObj });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Invalid product ID' });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a product image (JPG only)'
      });
    }

    console.log('📸 Product image received:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      stock: parseInt(req.body.stock),
      featured: req.body.featured === 'true',
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    };

    const product = await Product.create(productData);
    console.log('✅ Product created:', product._id);

    const productObj = product.toObject();
    productObj.imageUrl = `data:${productObj.image.contentType};base64,${productObj.image.data.toString('base64')}`;
    delete productObj.image;

    res.status(201).json({ status: 'success', data: productObj });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Update fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    product.featured = req.body.featured !== undefined ? req.body.featured === 'true' : product.featured;

    // Update image if new one provided
    if (req.file) {
      product.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await product.save();

    const productObj = product.toObject();
    if (productObj.image && productObj.image.data) {
      productObj.imageUrl = `data:${productObj.image.contentType};base64,${productObj.image.data.toString('base64')}`;
      delete productObj.image;
    }

    console.log('✅ Product updated:', product._id);
    res.status(200).json({ status: 'success', data: productObj });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    console.log('🗑️ Product deleted:', req.params.id);
    res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
