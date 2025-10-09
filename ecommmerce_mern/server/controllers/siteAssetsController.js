const SiteAssets = require('../models/SiteAssets');

// Get all site assets
exports.getSiteAssets = async (req, res) => {
  try {
    console.log('📥 Fetching site assets');

    let assets = await SiteAssets.findOne();

    // Create default if doesn't exist
    if (!assets) {
      assets = await SiteAssets.create({
        siteName: 'Bihar Ka Swaad',
        tagline: 'Authentic Flavors from Bihar',
        slideshow: []
      });
    }

    const assetsData = assets.toObject();

    // Convert logo to base64
    if (assetsData.logo && assetsData.logo.data) {
      assetsData.logoUrl = `data:${assetsData.logo.contentType};base64,${assetsData.logo.data.toString('base64')}`;
      delete assetsData.logo;
    }

    // Convert slideshow images to base64
    if (assetsData.slideshow) {
      assetsData.slideshow = assetsData.slideshow.map(slide => {
        if (slide.image && slide.image.data) {
          slide.imageUrl = `data:${slide.image.contentType};base64,${slide.image.data.toString('base64')}`;
          delete slide.image;
        }
        return slide;
      }).sort((a, b) => a.order - b.order);
    }

    console.log('✅ Site assets sent');
    res.status(200).json({ status: 'success', data: assetsData });
  } catch (error) {
    console.error('❌ Error fetching site assets:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Upload/Update Logo (Admin only)
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a logo image (JPG only)'
      });
    }

    console.log('📸 Logo uploaded:', req.file.originalname);

    let assets = await SiteAssets.findOne();

    if (!assets) {
      assets = await SiteAssets.create({
        siteName: 'Bihar Ka Swaad',
        tagline: 'Authentic Flavors from Bihar'
      });
    }

    assets.logo = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      uploadedAt: new Date()
    };

    await assets.save();

    const assetsData = assets.toObject();
    if (assetsData.logo && assetsData.logo.data) {
      assetsData.logoUrl = `data:${assetsData.logo.contentType};base64,${assetsData.logo.data.toString('base64')}`;
      delete assetsData.logo;
    }

    console.log('✅ Logo updated');
    res.status(200).json({
      status: 'success',
      message: 'Logo updated successfully',
      data: assetsData
    });
  } catch (error) {
    console.error('❌ Error uploading logo:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add Slideshow Image (Admin only)
exports.addSlideshow = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a slideshow image (JPG only)'
      });
    }

    const { title, subtitle, buttonText, buttonLink, order } = req.body;

    console.log('📸 Slideshow image uploaded:', req.file.originalname);

    let assets = await SiteAssets.findOne();

    if (!assets) {
      assets = await SiteAssets.create({
        siteName: 'Bihar Ka Swaad',
        tagline: 'Authentic Flavors from Bihar',
        slideshow: []
      });
    }

    const newSlide = {
      title: title || 'Welcome to Bihar Ka Swaad',
      subtitle: subtitle || '',
      buttonText: buttonText || 'Shop Now',
      buttonLink: buttonLink || '/products',
      order: parseInt(order) || assets.slideshow.length,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      uploadedAt: new Date()
    };

    assets.slideshow.push(newSlide);
    await assets.save();

    const assetsData = assets.toObject();
    assetsData.slideshow = assetsData.slideshow.map(slide => {
      if (slide.image && slide.image.data) {
        slide.imageUrl = `data:${slide.image.contentType};base64,${slide.image.data.toString('base64')}`;
        delete slide.image;
      }
      return slide;
    });

    console.log('✅ Slideshow added');
    res.status(200).json({
      status: 'success',
      message: 'Slideshow image added successfully',
      data: assetsData
    });
  } catch (error) {
    console.error('❌ Error adding slideshow:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete Slideshow Image (Admin only)
exports.deleteSlideshow = async (req, res) => {
  try {
    const { slideId } = req.params;

    let assets = await SiteAssets.findOne();

    if (!assets) {
      return res.status(404).json({
        status: 'error',
        message: 'Site assets not found'
      });
    }

    assets.slideshow = assets.slideshow.filter(
      slide => slide._id.toString() !== slideId
    );

    await assets.save();

    console.log('🗑️ Slideshow deleted');
    res.status(200).json({
      status: 'success',
      message: 'Slideshow image deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting slideshow:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update Site Settings (Admin only)
exports.updateSiteSettings = async (req, res) => {
  try {
    const { siteName, tagline } = req.body;

    let assets = await SiteAssets.findOne();

    if (!assets) {
      assets = await SiteAssets.create({ siteName, tagline });
    } else {
      if (siteName) assets.siteName = siteName;
      if (tagline) assets.tagline = tagline;
      await assets.save();
    }

    console.log('✅ Site settings updated');
    res.status(200).json({
      status: 'success',
      message: 'Site settings updated successfully',
      data: assets
    });
  } catch (error) {
    console.error('❌ Error updating site settings:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
