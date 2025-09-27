import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);

  const cartCount = items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">Bihar Ka Swaad</Link>
        <div className="flex items-center gap-4">
          <NavLink to="/products" className="text-gray-700 hover:text-blue-600">Products</NavLink>
          <NavLink to="/cart" className="relative text-gray-700 hover:text-blue-600">
            Cart
            <span className="ml-1 inline-flex items-center justify-center text-xs bg-blue-600 text-white rounded-full h-5 min-w-[20px] px-1">
              {cartCount}
            </span>
          </NavLink>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <NavLink to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</NavLink>
              )}
              <button onClick={() => dispatch(logout())} className="text-gray-700 hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-gray-700 hover:text-blue-600">Login</NavLink>
              <NavLink to="/signup" className="text-gray-700 hover:text-blue-600">Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
