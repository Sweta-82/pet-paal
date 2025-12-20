import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white/40 backdrop-blur-xl border-t border-white/50 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center group">
              <span className="text-3xl font-bold text-pastel-purple group-hover:text-pastel-pink transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>Pet-Paal</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed px-1">
              Connecting pets with loving homes. Join our community and make a difference in a pet's life today.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-[-4px] left-0 w-8 h-1 bg-pastel-yellow rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/browse-pets" className="text-base text-gray-600 hover:text-pastel-purple hover:translate-x-1 transform transition-all inline-block">Browse Pets</Link></li>
              <li><Link to="/resources" className="text-base text-gray-600 hover:text-pastel-purple hover:translate-x-1 transform transition-all inline-block">Resources</Link></li>
              <li><Link to="/blog" className="text-base text-gray-600 hover:text-pastel-purple hover:translate-x-1 transform transition-all inline-block">Blog</Link></li>
              <li><Link to="/donate" className="text-base text-gray-600 hover:text-pastel-pink hover:translate-x-1 transform transition-all inline-block font-medium">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-6 relative inline-block">
              Support
              <span className="absolute bottom-[-4px] left-0 w-8 h-1 bg-pastel-mint rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-base text-gray-600 hover:text-pastel-purple hover:translate-x-1 transform transition-all inline-block">Login</Link></li>
              <li><Link to="/register" className="text-base text-gray-600 hover:text-pastel-purple hover:translate-x-1 transform transition-all inline-block">Register</Link></li>
              <li><a href="#" className="text-base text-gray-600 hover:text-pastel-purple hover:translate-x-1 transform transition-all inline-block">Contact Us</a></li>
              <li><a href="#" className="text-base text-gray-600 hover:text-pastel-purple hover:translate-x-1 transform transition-all inline-block">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-6 relative inline-block">
              Follow Us
              <span className="absolute bottom-[-4px] left-0 w-8 h-1 bg-pastel-blue rounded-full"></span>
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/60 p-3 rounded-full text-gray-400 hover:text-white hover:bg-pastel-blue transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/60 p-3 rounded-full text-gray-400 hover:text-white hover:bg-pastel-blue transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/60 p-3 rounded-full text-gray-400 hover:text-white hover:bg-pastel-pink transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/60 p-3 rounded-full text-gray-400 hover:text-white hover:bg-pastel-purple transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-pastel-purple/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Pet-Paal. Made with <span className="text-pastel-pink">♥</span> for fluffy friends.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-pastel-purple transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-pastel-purple transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
