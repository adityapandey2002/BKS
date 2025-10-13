const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, cartItems, shippingAddress } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid amount'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise (multiply by 100)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items: cartItems,
      shippingAddress,
      totalAmount: amount,
      paymentInfo: {
        razorpayOrderId: razorpayOrder.id,
        status: 'pending'
      }
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    res.status(200).json({
      status: 'success',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        dbOrderId: order._id
      }
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified - Update order
      const order = await Order.findById(dbOrderId);

      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'Order not found'
        });
      }

      order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
      order.paymentInfo.razorpaySignature = razorpay_signature;
      order.paymentInfo.status = 'completed';
      order.orderStatus = 'processing';

      await order.save();

      console.log('✅ Payment verified:', razorpay_payment_id);

      res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully',
        data: order
      });
    } else {
      // Invalid signature
      const order = await Order.findById(dbOrderId);
      if (order) {
        order.paymentInfo.status = 'failed';
        await order.save();
      }

      res.status(400).json({
        status: 'error',
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get Order Details
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
