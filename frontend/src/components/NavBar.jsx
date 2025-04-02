import React, { useState, useEffect } from "react";
import { FaTrophy, FaInfoCircle, FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";
import axios from "axios";

const NavBar = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/notifications`,{
          params: { email: user.email },
        });
        setUnreadCount(data.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnreadCount();
  }, [user.email, showNotifications]);

  return (
    <>
      <nav className="w-full bg-gray-800 text-white flex justify-between items-center px-6 py-3 relative">
        <Link to="/">
          <h1 className="text-2xl md:text-3xl font-bold cursor-pointer">MANIT TYPE</h1>
        </Link>
        
        <div className="md:hidden cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </div>
        
        <div className={`absolute md:relative  top-full left-0 md:top-0 w-full md:w-auto bg-gray-800 md:flex-row flex items-center md:flex gap-4 text-2xl p-5 md:p-0 ${menuOpen ? "flex" : "hidden"}`}>
          <Link to="/leaderboard" className="block md:inline">
            <FaTrophy className="cursor-pointer hover:text-yellow-400 text-3xl" title="Leaderboard" />
          </Link>
          <Link to="/about" className="block md:inline">
            <FaInfoCircle className="cursor-pointer hover:text-green-400 text-3xl" title="About" />
          </Link>

          <div className="relative cursor-pointer block md:inline" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell className="hover:text-red-400 text-3xl" title="Notifications" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 text-3xl md:inline" title="Profile" onClick={() => setShowProfile(true)}>
            <FaUserCircle />
          </div>
        </div>

        {showNotifications && <NotificationModal user={user} onClose={() => setShowNotifications(false)} />}
      </nav>
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default NavBar;