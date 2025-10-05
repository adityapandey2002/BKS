const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Traditional Recipes', 'Food Culture', 'Health & Wellness', 'Festivals', 'Sustainability', 'Heritage']
  },
  image: {
    data: Buffer,        // Store actual image binary data
    contentType: String  // Store MIME type (image/jpeg)
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
