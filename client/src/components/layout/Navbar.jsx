import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { IoIosMenu } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaBell, FaUserCircle } from 'react-icons/fa';
import NotificationList from '../common/NotificationList';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null); // Keep for strict backward compat if needed, but we replace it.
  const desktopNotificationRef = useRef(null);
  const mobileNotificationRef = useRef(null);

  const isHome = location.pathname === '/';

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchNotifications());
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop = desktopNotificationRef.current && !desktopNotificationRef.current.contains(event.target);
      const isOutsideMobile = mobileNotificationRef.current && !mobileNotificationRef.current.contains(event.target);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`bg-transparent ${isHome ? 'text-white' : 'text-gray-900'} px-4 md:px-8 py-6 text-center absolute top-0 w-full z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center w-full justify-between gap-4">
          {/* logo */}
          <Link to="/" className={`text-2xl font-bold font-mono ${isHome ? 'text-white hover:text-white/90' : 'text-gray-900 hover:text-pastel-pink'} transition-colors tracking-tight whitespace-nowrap`}>
            PetPaal
          </Link>

          <div className={`hidden md:flex items-center gap-2 border px-3 py-1.5 rounded-2xl transition-all shadow-sm w-full max-w-xs ml-8 ${isHome ? 'border-white/20 bg-white/10 hover:border-white/40' : 'border-gray-300 bg-white/60 hover:border-pastel-pink'} backdrop-blur-md`}>
            <input
              type="text"
              placeholder="Search pets..."
              className={`bg-transparent text-sm outline-none w-full ${isHome ? 'text-white placeholder-white/70' : 'text-gray-800 placeholder-gray-500'}`}
            />
            <CiSearch className={`text-xl cursor-pointer ${isHome ? 'text-white' : 'text-gray-600 hover:text-pastel-pink'}`} />
          </div>

          <ul className={`hidden sm:flex gap-6 text-sm font-medium items-center ml-auto ${isHome ? 'text-white/90' : 'text-gray-800'}`}>
            <li><Link to="/" className={`${isHome ? 'hover:text-white' : 'hover:text-pastel-purple'} transition-colors`}>Home</Link></li>
            <li><Link to="/browse-pets" className={`${isHome ? 'hover:text-white' : 'hover:text-pastel-purple'} transition-colors whitespace-nowrap`}>Find a Pet</Link></li>
            <li><Link to="/resources" className={`${isHome ? 'hover:text-white' : 'hover:text-pastel-purple'} transition-colors`}>Resources</Link></li>
            <li><Link to="/donate" className={`${isHome ? 'hover:text-white' : 'hover:text-pastel-purple'} transition-colors`}>Donate</Link></li>

            {userInfo ? (
              <div className="flex items-center gap-4 ml-2">
                {/* Notifications */}
                <div className="relative" ref={desktopNotificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative focus:outline-none pt-1 ${isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-pastel-purple'}`}
                  >
                    <FaBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pastel-pink text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-pastel-purple/20 py-2 text-left border border-white/60 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                      <div className="px-5 py-3 border-b border-pastel-pink/20 font-bold text-gray-700 text-sm bg-pastel-purple/5">Notifications</div>
                      <div className="max-h-[60vh] overflow-y-auto">
                        <NotificationList notifications={notifications} onClose={() => setShowNotifications(false)} />
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/dashboard" className={`${isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-pastel-purple'} transition-colors`} title="Dashboard">
                  <FaUserCircle className="text-2xl" />
                </Link>

                <button
                  onClick={logoutHandler}
                  className={`bg-white text-pastel-purple border-2 rounded-2xl font-bold hover:bg-pastel-pink hover:text-white hover:border-pastel-pink transition-colors shadow-sm px-4 py-2 ${isHome ? 'border-white' : 'border-pastel-purple/20'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <li className={`bg-pastel-pink px-4 py-2 rounded-2xl text-white font-bold border-2 border-transparent transition-all shadow-sm ${isHome ? 'hover:bg-white hover:text-pastel-pink hover:border-white' : 'hover:bg-pastel-purple hover:text-white'}`}>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="sm:hidden flex items-center gap-4">
          {userInfo && (
            <div className="relative" ref={mobileNotificationRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className={`${isHome ? 'text-white' : 'text-gray-800'}`}>
                <FaBell className="h-6 w-6" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-pastel-pink h-3 w-3 rounded-full"></span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl py-1 text-left z-50 border border-white/20">
                  <NotificationList notifications={notifications} onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>
          )}
          <button onClick={() => setIsOpen(!isOpen)}>
            <IoIosMenu className={`text-3xl transition-colors ${isHome ? 'text-white hover:text-white/80' : 'text-gray-800 hover:text-pastel-pink'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-pastel-purple/95 backdrop-blur-md border-t border-white/20 py-4 px-4 flex flex-col gap-4 shadow-xl z-50">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-white/20 rounded text-gray-800">Home</Link>
          <Link to="/browse-pets" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-white/20 rounded text-gray-800">Find a Pet</Link>
          <Link to="/resources" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-white/20 rounded text-gray-800">Resources</Link>
          <Link to="/donate" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-white/20 rounded text-gray-800">Donate</Link>
          {userInfo ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-white/20 rounded text-gray-800">Dashboard</Link>
              <button onClick={logoutHandler} className="block w-full text-left py-2 text-white font-bold hover:bg-white/20 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 bg-pastel-pink text-white rounded-xl font-bold shadow-md">Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar;
