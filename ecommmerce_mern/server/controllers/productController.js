const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, q } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const products = await Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: products,
      pagination: { page: Number(page), limit: Number(limit), total }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ status: 'error', message: 'Product not found' });

    res.status(200).json({ status: 'success', data: prod });
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Invalid product id' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!updated) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
