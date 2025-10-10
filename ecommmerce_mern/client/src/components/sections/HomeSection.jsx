import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import { useSiteAssets } from '../../context/SiteAssetsContext';
import axios from 'axios';

const HomeSection = () => {
  const dispatch = useDispatch();
  const { list: featuredProducts, isLoading } = useSelector((s) => s.products);
  const [slideshow, setSlideshow] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteName, setSiteName] = useState('Bihar Ka Swaad');
  const [tagline, setTagline] = useState('Authentic Flavors from Bihar');
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const slideshowRef = useRef(null);
  const intervalRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch featured products
  useEffect(() => {
    dispatch(fetchProducts({ featured: true }));
  }, [dispatch]);

  // Fetch slideshow from database
  useEffect(() => {
    const fetchSiteAssets = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/site-assets`);
        if (data.data.slideshow && data.data.slideshow.length > 0) {
          const activeSlides = data.data.slideshow.filter(s => s.active !== false);
          setSlideshow(activeSlides);
        }
        if (data.data.siteName) setSiteName(data.data.siteName);
        if (data.data.tagline) setTagline(data.data.tagline);
      } catch (error) {
        console.error('Error fetching site assets:', error);
      }
    };
    fetchSiteAssets();
  }, [API_URL]);

  // Auto-rotate slideshow with pause functionality
  useEffect(() => {
    if (slideshow.length > 1 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideshow.length);
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slideshow.length, isPaused]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideshow.length);
  }, [slideshow.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideshow.length) % slideshow.length);
  }, [slideshow.length]);

  // Touch handling for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const activeSlides = slideshow?.filter(s => s.active !== false) || [];

  return (
    <div className="bg-gray-50">
      {/* Hero Slideshow Section */}
      {activeSlides.length > 0 ? (
        <div 
          ref={slideshowRef}
          className="relative h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Continuous Sliding Container */}
          <div 
            className="flex transition-transform duration-1000 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${activeSlides.length * 100}%`
            }}
          >
            {activeSlides.map((slide, index) => (
              <div
                key={slide._id}
                className="relative w-full h-full flex-shrink-0"
                style={{ width: `${100 / activeSlides.length}%` }}
              >
                {slide.imageUrl && (
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onLoad={(e) => {
                      // Preload next image for smoother transitions
                      if (index < activeSlides.length - 1 && activeSlides[index + 1]?.imageUrl) {
                        const nextImg = new Image();
                        nextImg.src = activeSlides[index + 1].imageUrl;
                      }
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-5xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-slide-in-up">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed animate-slide-in-up-delay">
                        {slide.subtitle}
                      </p>
                    )}
                    <Link
                      to={slide.buttonLink || '/products'}
                      className="inline-block bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-orange-700 transition-all duration-300 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 animate-slide-in-up-delay-2"
                    >
                      {slide.buttonText || 'Shop Now'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {activeSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 lg:opacity-100"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 lg:opacity-100"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${index === currentSlide
                    ? 'w-6 sm:w-8 h-2 sm:h-3 bg-white rounded-full shadow-lg'
                    : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/50 rounded-full hover:bg-white/75'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {activeSlides.length > 1 && !isPaused && (
            <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
              <div 
                className="h-full bg-white/80 transition-all duration-100 ease-linear"
                style={{
                  width: `${((currentSlide + 1) / activeSlides.length) * 100}%`
                }}
              />
            </div>
          )}
        </div>
      ) : (
        // Default Hero Section (if no slideshow)
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to {siteName}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {tagline}
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore Products
            </Link>
          </div>
        </div>
      )}

        {/* Quick Links Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/about"
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                About Us
              </h3>
              <p className="text-gray-600">
                Learn about our story, mission, and commitment to authentic Bihari flavors.
              </p>
            </Link>

            <Link
              to="/products"
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                Our Products
              </h3>
              <p className="text-gray-600">
                Browse our collection of authentic Bihari foods, sweets, and traditional items.
              </p>
            </Link>

            <Link
              to="/blog"
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                Blog
              </h3>
              <p className="text-gray-600">
                Read stories, recipes, and insights about Bihar's rich culinary heritage.
              </p>
            </Link>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Handpicked selections from our finest offerings</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {product.imageUrl && (
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-orange-600">₹{product.price}</p>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition duration-200 font-semibold"
            >
              View All Products
            </Link>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-white mb-8">
              Subscribe to our newsletter for the latest recipes, stories, and updates from {siteName}.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-full w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-orange-600 px-8 py-3 rounded-full hover:bg-gray-100 transition duration-200 font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default HomeSection;



