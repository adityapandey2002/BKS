const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(200).json({ status: 'success', data: { items: [], totalAmount: 0 } });
    }

    // Convert image buffer to base64 for each product in cart items
    const cartWithImages = cart.toObject();
    cartWithImages.items = cartWithImages.items.map(item => {
      if (item.product && item.product.image && item.product.image.data) {
        item.product.imageUrl = `data:${item.product.image.contentType};base64,${item.product.image.data.toString('base64')}`;
        delete item.product.image;
      }
      return item;
    });

    res.status(200).json({ status: 'success', data: cartWithImages });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) {
      cart.items[idx].quantity += quantity;
      cart.items[idx].price = product.price;
    } else {
      cart.items.push({ product: product._id, quantity, price: product.price });
    }

    await cart.save();
    await cart.populate('items.product');

    // Convert image buffer to base64 for each product in cart items
    const cartWithImages = cart.toObject();
    cartWithImages.items = cartWithImages.items.map(item => {
      if (item.product && item.product.image && item.product.image.data) {
        item.product.imageUrl = `data:${item.product.image.contentType};base64,${item.product.image.data.toString('base64')}`;
        delete item.product.image;
      }
      return item;
    });

    res.status(200).json({ status: 'success', data: cartWithImages });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ status: 'error', message: 'Quantity must be >= 1' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ status: 'error', message: 'Item not in cart' });

    cart.items[idx].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    // Convert image buffer to base64 for each product in cart items
    const cartWithImages = cart.toObject();
    cartWithImages.items = cartWithImages.items.map(item => {
      if (item.product && item.product.image && item.product.image.data) {
        item.product.imageUrl = `data:${item.product.image.contentType};base64,${item.product.image.data.toString('base64')}`;
        delete item.product.image;
      }
      return item;
    });

    res.status(200).json({ status: 'success', data: cartWithImages });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const before = cart.items.length;
    cart.items = cart.items.filter(i => i.product.toString() !== productId);

    if (cart.items.length === before) return res.status(404).json({ status: 'error', message: 'Item not in cart' });

    await cart.save();
    await cart.populate('items.product');

    // Convert image buffer to base64 for each product in cart items
    const cartWithImages = cart.toObject();
    cartWithImages.items = cartWithImages.items.map(item => {
      if (item.product && item.product.image && item.product.image.data) {
        item.product.imageUrl = `data:${item.product.image.contentType};base64,${item.product.image.data.toString('base64')}`;
        delete item.product.image;
      }
      return item;
    });

    res.status(200).json({ status: 'success', data: cartWithImages });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ status: 'success', data: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
