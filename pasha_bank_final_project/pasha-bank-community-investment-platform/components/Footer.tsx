
import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-pasha-gray-light border-t border-pasha-gray">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-pasha-gray-dark">
          &copy; {currentYear} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-xs text-pasha-gray-dark mt-1">
          Empowering community growth, together with Pasha Bank.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
