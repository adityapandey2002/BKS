const Blog = require('../models/Blog');

// Get all blogs (with images converted to base64)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });

    // Convert image buffer to base64 for each blog
    const blogsWithImages = blogs.map(blog => {
      const blogObj = blog.toObject();

      // Convert Buffer to base64 if image exists
      if (blogObj.image && blogObj.image.data) {
        blogObj.imageUrl = `data:${blogObj.image.contentType};base64,${blogObj.image.data.toString('base64')}`;
      }

      // Remove the raw buffer data to reduce response size
      delete blogObj.image;

      return blogObj;
    });

    console.log(`✅ Sending ${blogsWithImages.length} blogs with images`);
    res.status(200).json({ status: 'success', data: blogsWithImages });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}; // ← FIXED: Added closing brace

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || !blog.published) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }

    const blogObj = blog.toObject();

    // Convert image to base64
    if (blogObj.image && blogObj.image.data) {
      blogObj.imageUrl = `data:${blogObj.image.contentType};base64,${blogObj.image.data.toString('base64')}`;
    }

    delete blogObj.image;

    res.status(200).json({ status: 'success', data: blogObj });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Invalid blog ID' });
  }
}; // ← FIXED: Added closing brace

// Get blog image (serve as actual image)
exports.getBlogImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || !blog.image || !blog.image.data) {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }

    // Set content type and send binary data
    res.set('Content-Type', blog.image.contentType);
    res.send(blog.image.data);
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Invalid blog ID' });
  }
}; // ← FIXED: Added closing brace

// Create blog with image
exports.createBlog = async (req, res) => {
  try {
    // Check if image file exists
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a JPG image'
      });
    }

    console.log('📸 Image received:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Create blog with image binary data
    const blogData = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      author: req.body.author,
      category: req.body.category,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    };

    const blog = await Blog.create(blogData);
    console.log('✅ Blog created with ID:', blog._id);

    // Return blog with base64 image
    const blogObj = blog.toObject();
    blogObj.imageUrl = `data:${blogObj.image.contentType};base64,${blogObj.image.data.toString('base64')}`;
    delete blogObj.image;

    res.status(201).json({ status: 'success', data: blogObj });
  } catch (error) {
    console.error('❌ Error creating blog:', error);
    res.status(400).json({ status: 'error', message: error.message });
  }
}; // ← FIXED: Added closing brace

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }

    console.log('🗑️ Blog deleted:', req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
}; // ← FIXED: Added closing brace
