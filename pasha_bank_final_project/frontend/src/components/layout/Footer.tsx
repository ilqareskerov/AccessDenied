import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pasha-green text-white mt-auto shadow-inner">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm opacity-90">
          &copy; {currentYear} Pasha Bank Community Investment Platform. All Rights Reserved.
        </p>
        {/* Optional: Add links to privacy policy, terms, etc. */}
        {/* <div className="mt-2 space-x-4">
          <a href="#" className="text-xs hover:underline">Privacy Policy</a>
          <a href="#" className="text-xs hover:underline">Terms of Service</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;

