import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const NotificationModal = ({ onClose,user }) => {
  const [notifications, setNotifications] = useState([]);
  console.log(user);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/notifications`,{
          params: { email: user.email },
        });
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [user.email]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/notifications/${id}`, { email: user.email });
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  
  return (
    <div className="absolute right-0 top-16 w-80 bg-gray-900 text-white shadow-lg rounded-lg p-4 z-50">
      <h3 className="text-lg font-bold mb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-400">No new notifications</p>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {notifications.map((notif) => (
            <div key={notif._id} className="border-b border-gray-700 flex justify-between items-center">
              <span>{notif.message}</span>
              <button
                onClick={() => markAsRead(notif._id)}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                Mark as read
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose} className="w-full mt-3 bg-red-500 hover:bg-red-400 text-white py-1 rounded">
        Close
      </button>
    </div>
  );
};

export default NotificationModal;
