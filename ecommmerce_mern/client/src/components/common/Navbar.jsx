import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import axios from 'axios';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [siteName, setSiteName] = useState('Bihar Ka Swaad');

  const cartCount = items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch logo and site name from database
  useEffect(() => {
    const fetchSiteAssets = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/site-assets`);
        if (data.data.logoUrl) {
          setLogo(data.data.logoUrl);
        }
        if (data.data.siteName) {
          setSiteName(data.data.siteName);
        }
      } catch (error) {
        console.error('Error fetching site assets:', error);
      }
    };
    fetchSiteAssets();
  }, [API_URL]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isUserMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {logo ? (
              <img
                src={logo}
                alt={siteName}
                className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <span className="text-white text-2xl font-bold">
                    {siteName.charAt(0)}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {siteName}
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">BKS</p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation - Text Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 hover:text-orange-600 font-medium transition duration-200 ${isActive ? 'text-orange-600 border-b-2 border-orange-600' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-700 hover:text-orange-600 font-medium transition duration-200 ${isActive ? 'text-orange-600 border-b-2 border-orange-600' : ''
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-gray-700 hover:text-orange-600 font-medium transition duration-200 ${isActive ? 'text-orange-600 border-b-2 border-orange-600' : ''
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-gray-700 hover:text-orange-600 font-medium transition duration-200 ${isActive ? 'text-orange-600 border-b-2 border-orange-600' : ''
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-gray-700 hover:text-orange-600 font-medium transition duration-200 ${isActive ? 'text-orange-600 border-b-2 border-orange-600' : ''
                }`
              }
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/track-order"
              className={({ isActive }) =>
                `text-gray-700 hover:text-orange-600 font-medium transition duration-200 ${isActive ? 'text-orange-600 border-b-2 border-orange-600' : ''
                }`
              }
            >
              Track Order
            </NavLink>
          </div>

          {/* Mobile Navigation - Icon Links */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-orange-600 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-orange-600 transition duration-200 relative"
              title="Wishlist"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="text-gray-700 hover:text-orange-600 transition duration-200 relative"
              title="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu or Auth Links */}
            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden xl:block text-sm font-medium">My Account</span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Auth Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/wishlist" className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <Link to="/cart" className="text-gray-700 relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mobile-menu-container">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink to="/" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md">Home</NavLink>
              <NavLink to="/about" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md">About Us</NavLink>
              <NavLink to="/products" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md">Products</NavLink>
              <NavLink to="/blog" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md">Blog</NavLink>
              <NavLink to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md">Contact Us</NavLink>
              <NavLink to="/track-order" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md">Track Order</NavLink>
              {isAuthenticated && user?.role === 'admin' && (
                <NavLink to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md">Dashboard</NavLink>
              )}
              {isAuthenticated && (
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md">Logout</button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
