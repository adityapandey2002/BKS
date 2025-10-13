import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import { useSiteAssets } from '../../context/SiteAssetsContext';

const HomeSection = () => {
  const dispatch = useDispatch();
  const { list: featuredProducts, isLoading } = useSelector((state) => state.products);
  const { slideshow, siteName, tagline, loading: assetsLoading } = useSiteAssets();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured products on mount
  useEffect(() => {
    dispatch(fetchProducts({ featured: true }));
  }, [dispatch]);

  // Filter active slides
  const activeSlides = slideshow?.filter(slide => slide.active !== false) || [];

  // Auto-advance slideshow every 2 seconds
  useEffect(() => {
    if (activeSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % activeSlides.length);
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [activeSlides.length]);

  // Manual navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? activeSlides.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Slideshow Section - OPTIMIZED FOR 1920x600 */}
      {!assetsLoading && activeSlides.length > 0 ? (
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] overflow-hidden bg-gray-900">
          {/* Slides Container */}
          {activeSlides.map((slide, index) => (
            <div
              key={slide._id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Image - Perfect fit for 1920x600 */}
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
              )}

              {/* Text Overlay - Only if title/subtitle exists */}
              {(slide.title || slide.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center pb-8 md:pb-12 lg:pb-16">
                  <div className="text-center text-white px-4 max-w-5xl">
                    {slide.title && (
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 md:mb-3 drop-shadow-2xl">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl drop-shadow-2xl">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Arrows */}
          {activeSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition z-20"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition z-20"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          {activeSlides.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold backdrop-blur-sm z-20">
              {currentSlide + 1} / {activeSlides.length}
            </div>
          )}
        </div>
      ) : (
        // Default Hero (no slideshow)
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Welcome to {siteName}
            </h1>
            <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto">
              {tagline}
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-orange-600 px-6 md:px-8 py-2 md:py-4 rounded-full hover:bg-gray-100 transition font-semibold text-sm md:text-lg shadow-lg"
            >
              Explore Products
            </Link>
          </div>
        </div>
      )}

      {/* Quick Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Link
            to="/about"
            className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
              About Us
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Learn about our story, mission, and commitment to authentic Bihari flavors.
            </p>
          </Link>

          <Link
            to="/products"
            className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
              Our Products
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Browse our collection of authentic Bihari foods, sweets, and traditional items.
            </p>
          </Link>

          <Link
            to="/blog"
            className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 group"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
              Blog
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Read stories, recipes, and insights about Bihar's rich culinary heritage.
            </p>
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Featured Products</h2>
          <p className="text-base md:text-xl text-gray-600">Handpicked selections from our finest offerings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm md:text-base">Loading featured products...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No featured products available at the moment.</p>
            <Link 
              to="/products"
              className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {product.imageUrl && (
                    <div className="relative overflow-hidden h-40 md:h-56">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    </div>
                  )}
                  <div className="p-3 md:p-6">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 group-hover:text-orange-600 transition line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2 hidden md:block">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-lg md:text-2xl font-bold text-orange-600">₹{product.price}</p>
                      <span className="text-xs md:text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-12">
              <Link
                to="/products"
                className="inline-block bg-orange-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-orange-700 transition font-semibold text-sm md:text-base shadow-lg"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            Stay Updated
          </h2>
          <p className="text-base md:text-xl text-white mb-6 md:mb-8">
            Subscribe to our newsletter for the latest recipes, stories, and updates from {siteName}.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 md:px-6 py-2 md:py-3 rounded-full w-full sm:w-80 md:w-96 focus:outline-none focus:ring-2 focus:ring-white text-sm md:text-base"
            />
            <button
              type="submit"
              className="bg-white text-orange-600 px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-gray-100 transition font-semibold text-sm md:text-base"
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
