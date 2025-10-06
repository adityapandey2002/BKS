import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';

const HomeSection = () => {
  const dispatch = useDispatch();
  const { list: featuredProducts, isLoading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 rounded-lg mb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Bihar Ka Swaad</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the authentic flavors of Bihar with our carefully curated collection
            of traditional foods, sweets, and spices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Explore Our Sections</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/about" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition duration-200">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">About Us</h3>
              <p className="text-gray-600">Learn about our story, mission, and commitment to authentic Bihari flavors.</p>
            </div>
          </Link>

          <Link to="/products" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition duration-200">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Products</h3>
              <p className="text-gray-600">Browse our collection of authentic Bihari foods, sweets, and traditional items.</p>
            </div>
          </Link>

          <Link to="/blog" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-200 transition duration-200">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog</h3>
              <p className="text-gray-600">Read stories, recipes, and insights about Bihar's rich culinary heritage.</p>
            </div>
          </Link>

          <Link to="/contact" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-200 transition duration-200">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600">Get in touch with us for any questions, feedback, or support.</p>
            </div>
          </Link>

          <Link to="/track-order" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-indigo-200 transition duration-200">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Order</h3>
              <p className="text-gray-600">Track your order status and get real-time updates on delivery.</p>
            </div>
          </Link>

          <Link to="/wishlist" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-pink-200 transition duration-200">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wishlist</h3>
              <p className="text-gray-600">Save your favorite items and add them to cart when you're ready.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Featured Products</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading featured products...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for the latest recipes, stories, and updates from Bihar Ka Swaad.
        </p>
        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
