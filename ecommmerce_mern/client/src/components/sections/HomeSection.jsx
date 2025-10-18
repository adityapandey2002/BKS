import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';

const HomeSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, isLoading, error } = useSelector((state) => state.products);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Auto-play carousel
  useEffect(() => {
    if (list && list.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % list.length);
      }, 3000); // Change slide every 3 seconds
      return () => clearInterval(timer);
    }
  }, [list]);

  const handleSlideClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % list.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + list.length) % list.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section with Carousel */}
      <section className="relative w-full overflow-hidden">
        {isLoading ? (
          <div className="w-full bg-gray-200 flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
            <p className="text-xl text-gray-600">Loading slides...</p>
          </div>
        ) : error ? (
          <div className="w-full bg-red-100 flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
            <p className="text-xl text-red-600">{error}</p>
          </div>
        ) : list && list.length > 0 ? (
          <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
            {/* Carousel Images */}
            <div className="absolute inset-0">
              {list.map((product, index) => (
                <div
                  key={product._id}
                  className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={() => handleSlideClick(product._id)}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain bg-gray-100"
                  />
                  {/* Product Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h2 className="text-white text-2xl md:text-4xl font-bold">{product.name}</h2>
                    <p className="text-white/90 text-lg mt-2">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all z-10"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all z-10"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {list.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-gray-200 flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
            <p className="text-xl text-gray-600">No products available</p>
          </div>
        )}
      </section>

      {/* Welcome Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to Bihar Ka Swaad
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover the authentic flavors of Bihar with our carefully curated collection of traditional foods, sweets, and spices.
          </p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 font-semibold"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Us Card */}
          <Link to="/about" className="group">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                About Us
              </h3>
              <p className="text-gray-600">
                Learn about our story, mission, and commitment to authentic Bihari flavors.
              </p>
            </div>
          </Link>

          {/* Products Card */}
          <Link to="/products" className="group">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                Products
              </h3>
              <p className="text-gray-600">
                Browse our collection of authentic Bihari foods, sweets, and traditional items.
              </p>
            </div>
          </Link>

          {/* Blog Card */}
          <Link to="/blog" className="group">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                Blog
              </h3>
              <p className="text-gray-600">
                Read stories, recipes, and insights about Bihar's rich culinary heritage.
              </p>
            </div>
          </Link>

          {/* Contact Card */}
          <Link to="/contact" className="group">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                Contact Us
              </h3>
              <p className="text-gray-600">
                Get in touch with us for any questions, feedback, or support.
              </p>
            </div>
          </Link>

          {/* Track Order Card */}
          <Link to="/track-order" className="group">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                Track Order
              </h3>
              <p className="text-gray-600">
                Track your order status and get real-time updates on delivery.
              </p>
            </div>
          </Link>

          {/* Wishlist Card */}
          <Link to="/wishlist" className="group">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                Wishlist
              </h3>
              <p className="text-gray-600">
                Save your favorite items and add them to cart when you're ready.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16 bg-orange-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Featured Products
        </h2>
        {isLoading ? (
          <div className="text-center text-xl text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="text-center text-xl text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {list && list.slice(0, 3).map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">₹{product.price}</span>
                    <Link
                      to={`/products/${product._id}`}
                      className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
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

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-orange-500 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8">
            Subscribe to our newsletter for the latest recipes, stories, and updates from Bihar Ka Swaad.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
