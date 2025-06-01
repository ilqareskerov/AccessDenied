import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-pasha-red shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-200 transition duration-300">
          {/* Replace with Pasha Bank Logo SVG or Image if available */}
          Pasha Community
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-200 transition duration-300 px-3 py-2 rounded-md text-sm font-medium">
            Home
          </Link>
          <Link to="/dashboard" className="text-white hover:text-gray-200 transition duration-300 px-3 py-2 rounded-md text-sm font-medium">
            Dashboard
          </Link>
          {/* Add Login/Register or User Profile links later */}
          <Link to="/login" className="bg-pasha-green text-white hover:bg-opacity-90 transition duration-300 px-4 py-2 rounded-md text-sm font-medium">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

