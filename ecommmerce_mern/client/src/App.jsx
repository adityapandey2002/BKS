import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SiteAssetsProvider } from './context/SiteAssetsContext';

// Layout
import Layout from './components/Layout';

// Section Components
import HomeSection from './components/sections/HomeSection';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import BlogSection from './components/sections/BlogSection';
import TrackOrderSection from './components/sections/TrackOrderSection';

import OrderSuccess from './pages/Ordersuccess';




// Pages
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <SiteAssetsProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            {/* Main Layout with Outlet */}
            <Route path="/" element={<Layout />}>
              {/* Home Page Sections */}
              <Route index element={<HomeSection />} />
              <Route path="about" element={<AboutSection />} />
              <Route path="contact" element={<ContactSection />} />
              <Route path="blog" element={<BlogSection />} />
              <Route path="track-order" element={<TrackOrderSection />} />

              {/* Other Pages */}
              <Route path="products" element={<ProductListing />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold text-gray-600 mb-4">404</h1>
                    <p className="text-gray-500">Page not found</p>
                  </div>
                }
              />

              <Route path="order-success/:orderId" 
            element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            </Route>

            
            
          </Routes>
        </Router>
      </SiteAssetsProvider>
    </Provider>
  );
}

export default App;
