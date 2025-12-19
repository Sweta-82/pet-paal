import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-pastel-bg bg-opacity-50 px-4 text-center">
      <div className="bg-white/60 backdrop-blur-xl p-12 rounded-3xl shadow-2xl shadow-pastel-purple/20 max-w-lg w-full transform hover:scale-105 transition-all duration-500 border border-white/60">
        <div className="flex justify-center mb-8">
          <div className="bg-pastel-purple/10 p-8 rounded-full shadow-inner">
            <FaPaw className="w-20 h-20 text-pastel-purple animate-bounce" />
          </div>
        </div>

        <h1 className="text-7xl font-extrabold text-gray-900 mb-2 drop-shadow-sm" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>Page Not Found</h2>
        <p className="text-gray-600 mb-10 text-lg font-medium">
          Oops! It looks like you've wandered off the path. The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-gradient-to-r from-pastel-purple to-pastel-pink hover:to-pastel-purple transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
