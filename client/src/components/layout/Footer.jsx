import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-forest-green">Pet-Paal</span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm">
              Connecting pets with loving homes. Join our community and make a difference in a pet's life today.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/browse-pets" className="text-base text-gray-500 hover:text-forest-green transition-colors">Browse Pets</Link></li>
              <li><Link to="/resources" className="text-base text-gray-500 hover:text-forest-green transition-colors">Resources</Link></li>
              <li><Link to="/blog" className="text-base text-gray-500 hover:text-forest-green transition-colors">Blog</Link></li>
              <li><Link to="/donate" className="text-base text-gray-500 hover:text-forest-green transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-base text-gray-500 hover:text-forest-green transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-base text-gray-500 hover:text-forest-green transition-colors">Register</Link></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-forest-green transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-forest-green transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-forest-green transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-forest-green transition-colors">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-forest-green transition-colors">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-forest-green transition-colors">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Pet-Paal. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
