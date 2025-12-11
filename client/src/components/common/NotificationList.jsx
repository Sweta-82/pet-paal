import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { markNotificationAsRead } from '../../redux/slices/notificationSlice';
import { FaCircle } from 'react-icons/fa';

const NotificationList = ({ notifications, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRead = (id, read) => {
    if (!read) {
      dispatch(markNotificationAsRead(id));
    }
  };

  if (notifications.length === 0) {
    return <div className="p-4 text-gray-500 text-center">No notifications</div>;
  }

  const handleNotificationClick = (notification) => {
    handleRead(notification._id, notification.read);
    onClose();

    // Navigation logic
    if (notification.type === 'new_message') {
      navigate('/chat');
    } else if (notification.type === 'application_status' || notification.type === 'new_application') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-green-50' : ''}`}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="flex justify-between items-start">
            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              {notification.message}
            </p>
            {!notification.read && <FaCircle className="text-forest-green w-2 h-2 mt-1 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
