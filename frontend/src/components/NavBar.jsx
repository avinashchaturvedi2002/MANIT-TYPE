import React, { useState, useEffect } from "react";
import { FaTrophy, FaInfoCircle, FaBell, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";
import axios from "axios";

const NavBar = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/v1/user/notifications/`,{
          params: { email: user.email },
        });
        setUnreadCount(data.length); // Set count of unread notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnreadCount();
  }, [user.email, showNotifications]); // Refetch when modal opens/closes

  return (
    <>
      <nav className="w-full bg-gray-800 text-white flex justify-between items-center px-6 py-3 relative">
        <Link to="/">
          <h1 className="text-3xl font-bold cursor-pointer">MANIT TYPE</h1>
        </Link>
        <div className="flex gap-4 text-2xl">
          <Link to="/leaderboard">
            <FaTrophy className="cursor-pointer hover:text-yellow-400" title="Leaderboard" />
          </Link>
          <Link to="/about">
  <FaInfoCircle className="cursor-pointer hover:text-green-400" title="About" />
</Link>

          
          {/* Bell Icon with Unread Badge */}
          <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell className="hover:text-red-400" title="Notifications" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Profile Icon */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300" title="Profile" onClick={() => setShowProfile(true)}>
            <FaUserCircle />
            <span className="text-lg">{user.displayName}</span>
          </div>
        </div>

        {/* Show Notification Modal */}
        {showNotifications && <NotificationModal user={user} onClose={() => setShowNotifications(false)} />}
      </nav>

      {/* Show Profile Modal */}
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default NavBar;
