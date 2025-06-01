
import React from 'react';
import { Link } from 'react-router-dom';
import { Icons, APP_NAME } from '../constants';
import { useInvestment } from '../contexts/InvestmentContext';

const Navbar: React.FC = () => {
  const { user } = useInvestment();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Icons.Logo className="h-10 w-auto" />
              <span className="text-xl font-bold text-pasha-blue hidden md:block">{APP_NAME}</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-pasha-blue-dark hover:text-pasha-gold font-medium px-3 py-2 rounded-md text-sm transition-colors">
              Discover Projects
            </Link>
            <Link to="/dashboard" className="text-pasha-blue-dark hover:text-pasha-gold font-medium px-3 py-2 rounded-md text-sm transition-colors">
              My Dashboard
            </Link>
             {user && (
              <div className="flex items-center space-x-2 text-pasha-blue-dark">
                <Icons.UserCircle className="h-7 w-7" />
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
