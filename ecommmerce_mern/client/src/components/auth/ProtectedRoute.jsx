import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
