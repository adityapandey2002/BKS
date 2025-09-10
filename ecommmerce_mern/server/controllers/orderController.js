const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'card' } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Cart is empty' });
    }

    const orderItems = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.price
    }));

    const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderStatus: 'pending',
      isPaid: false,
      isDelivered: false
    });

    // Optionally clear cart after creating order
    cart.items = [];
    await cart.save();

    res.status(201).json({ status: 'success', data: order });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const ord = await Order.findById(req.params.id).populate('orderItems.product', 'name price');
    if (!ord) return res.status(404).json({ status: 'error', message: 'Order not found' });

    // Ensure only owner or admin can view
    if (ord.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    res.status(200).json({ status: 'success', data: ord });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Invalid order id' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid, paidAt, isDelivered, deliveredAt, paymentResult } = req.body;
    const ord = await Order.findById(req.params.id);
    if (!ord) return res.status(404).json({ status: 'error', message: 'Order not found' });

    if (status) ord.orderStatus = status;
    if (typeof isPaid === 'boolean') ord.isPaid = isPaid;
    if (paidAt) ord.paidAt = paidAt;
    if (typeof isDelivered === 'boolean') ord.isDelivered = isDelivered;
    if (deliveredAt) ord.deliveredAt = deliveredAt;
    if (paymentResult) ord.paymentResult = paymentResult;

    await ord.save();
    res.status(200).json({ status: 'success', data: ord });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
