import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2025 Bihar Ka Swaad. Built with MERN Stack + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
