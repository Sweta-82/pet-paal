import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-off-white px-4 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-forest-green/10 p-6 rounded-full">
            <FaPaw className="w-16 h-16 text-forest-green animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! It looks like you've wandered off the path. The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-forest-green hover:bg-green-700 md:text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
