const mongoose = require('mongoose');

const siteAssetsSchema = new mongoose.Schema({
  // Logo
  logo: {
    data: Buffer,
    contentType: String,
    uploadedAt: Date
  },

  // Homepage Slideshow
  slideshow: [{
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Shop Now'
    },
    buttonLink: {
      type: String,
      default: '/products'
    },
    image: {
      data: Buffer,
      contentType: String
    },
    order: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Site Settings
  siteName: {
    type: String,
    default: 'Bihar Ka Swaad'
  },
  tagline: {
    type: String,
    default: 'Authentic Flavors from Bihar'
  }
}, {
  timestamps: true
});

// Ensure only one document exists
siteAssetsSchema.index({}, { unique: true });

module.exports = mongoose.model('SiteAssets', siteAssetsSchema);
