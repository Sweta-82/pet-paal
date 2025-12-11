import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { FaBars, FaTimes, FaPaw, FaBell } from 'react-icons/fa';
import NotificationList from '../common/NotificationList';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (userInfo) {
        dispatch(fetchNotifications());
    }
  }, [userInfo, dispatch]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaPaw className="h-8 w-8 text-forest-green" />
              <span className="ml-2 text-2xl font-bold text-gray-800 tracking-tight">Pet<span className="text-forest-green">Paal</span></span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-forest-green font-medium transition-colors">Home</Link>
            <Link to="/browse-pets" className="text-gray-600 hover:text-forest-green font-medium transition-colors">Browse Pets</Link>
            <Link to="/blog" className="text-gray-600 hover:text-forest-green font-medium transition-colors">Blog</Link>
            <Link to="/donate" className="text-gray-600 hover:text-forest-green font-medium transition-colors">Donate</Link>
            <Link to="/resources" className="text-gray-600 hover:text-forest-green font-medium transition-colors">Resources</Link>
            
            {userInfo ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="text-gray-600 hover:text-forest-green relative focus:outline-none"
                    >
                        <FaBell className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                            <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-700">Notifications</div>
                            <NotificationList notifications={notifications} onClose={() => setShowNotifications(false)} />
                        </div>
                    )}
                </div>

                {userInfo.role === 'admin' && (
                    <Link to="/admin" className="text-gray-600 hover:text-forest-green font-medium transition-colors">Admin</Link>
                )}
                <Link to="/dashboard" className="bg-forest-green text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-colors shadow-md">
                  Dashboard
                </Link>
                <button onClick={logoutHandler} className="text-gray-600 hover:text-red-500 font-medium transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-forest-green font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-forest-green text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-colors shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-forest-green focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/browse-pets" className="text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Browse Pets</Link>
            <Link to="/resources" className="text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Resources</Link>
            {userInfo ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                 {userInfo.role === 'admin' && (
                    <Link to="/admin" className="text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                )}
                <button onClick={logoutHandler} className="text-left w-full text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                <Link to="/register" className="text-gray-600 hover:text-forest-green block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
