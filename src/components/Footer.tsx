
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-border mt-auto">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-8 h-8 rounded-full legacy-gradient flex items-center justify-center">
              <span className="text-white font-semibold">FT</span>
            </div>
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Final Thread</span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link to="/about" className="hover:underline me-4 md:me-6">About</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline me-4 md:me-6">Terms</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">Contact</Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {new Date().getFullYear()} <Link to="/" className="hover:underline">Final Thread™</Link>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
