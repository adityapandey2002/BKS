import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AddBlog from '../admin/AddBlog';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const categories = [
    'All',
    'Traditional Recipes',
    'Food Culture',
    'Health & Wellness',
    'Festivals',
    'Sustainability',
    'Heritage'
  ];

  // Fetch blogs from MongoDB
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching blogs from:', `${API_URL}/blogs`);

      const { data } = await axios.get(`${API_URL}/blogs`);
      console.log('✅ Blogs received:', data.data?.length || 0);

      // Log first blog to check image
      if (data.data && data.data.length > 0) {
        console.log('🖼️ First blog image check:', {
          hasImageUrl: !!data.data[0].imageUrl,
          imageUrlPreview: data.data[0].imageUrl?.substring(0, 50) + '...'
        });
      }

      setBlogs(data.data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching blogs:', err);
      setError(err.response?.data?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs by category
  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter((blog) => blog.category === selectedCategory);

  // Delete blog handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchBlogs();
      alert('✅ Blog deleted successfully');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Failed to delete blog'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Blogs</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stories, recipes, and insights from Bihar's rich culinary heritage
          </p>
          <p className="text-sm text-gray-500 mt-2">
            📦 All images stored in MongoDB database
          </p>
        </div>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="mb-12">
            <AddBlog onBlogAdded={fetchBlogs} />
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* No Blogs Message */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Blogs Found</h3>
            <p className="text-gray-500 mb-4">
              {selectedCategory !== 'All'
                ? `No blogs in "${selectedCategory}" category.`
                : 'No blogs available. Upload your first blog!'}
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Blogs
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {filteredBlogs[0] && (
              <div className="mb-16">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      {filteredBlogs[0].imageUrl ? (
                        <img
                          src={filteredBlogs[0].imageUrl}
                          alt={filteredBlogs[0].title}
                          className="w-full h-64 md:h-full object-cover"
                          onError={(e) => {
                            console.error('❌ Image load error for featured blog');
                            e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {filteredBlogs[0].category}
                        </span>
                        <span className="text-gray-500 text-sm ml-4">
                          {new Date(filteredBlogs[0].createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {filteredBlogs[0].title}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {filteredBlogs[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold">
                            {filteredBlogs[0].author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{filteredBlogs[0].author}</p>
                            <p className="text-xs text-gray-500">Author</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(filteredBlogs[0]._id)}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.slice(1).map((post) => (
                <article
                  key={post._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          console.error('❌ Image load error for blog:', post._id);
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3 text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-2 flex items-center justify-center text-white text-xs font-semibold">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{post.author}</span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          title="Delete blog"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Total Count */}
            <div className="text-center mt-12">
              <p className="text-gray-600 text-lg">
                Showing <span className="font-semibold text-blue-600">{filteredBlogs.length}</span>{' '}
                {filteredBlogs.length === 1 ? 'blog' : 'blogs'}
                {selectedCategory !== 'All' && (
                  <span> in <span className="font-semibold">{selectedCategory}</span></span>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogSection;
