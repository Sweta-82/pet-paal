import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-forest-green py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to meet your new best friend?
        </h2>
        <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto">
          Join thousands of happy families who have found their perfect pet through Pet-Paal.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/browse"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-forest-green bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Browse Pets
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
