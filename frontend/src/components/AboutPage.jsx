import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import NavBar from "./NavBar";
import LeetCodeIcon from "../assets/lc.svg";
import TechStack from "./TechStack";

const AboutPage = ({ user }) => {
  const [stats, setStats] = useState({ totalTests: 0, duration: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/stats/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({ totalTests: 0, duration: 0 });
      }
    };
  
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* <NavBar user={user} /> */}
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 w-full space-y-6 sm:space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">About This Platform</h1>
        <p className="text-md sm:text-lg text-center">
          Created with ❤️ by
          <a
            href="https://www.linkedin.com/in/avinash-chaturvedi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline ml-1"
          >
            Avinash Chaturvedi
          </a>
        </p>

        {/* Statistics */}
        <h1 className="text-2xl sm:text-3xl text-gray-500 font-bold">Statistics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="text-lg bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col justify-center items-center w-full h-36">
            <div className="text-gray-400">Total Typing Tests</div>
            <div className="text-5xl sm:text-6xl">{stats.totalTests}</div>
            <div className="text-gray-400">{1000 - stats.totalTests} to reach 1000</div>
          </div>
          <div className="text-lg bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col justify-center items-center w-full h-36">
            <div className="text-gray-400">Total Typing Time</div>
            <div className="text-5xl sm:text-6xl">{stats.duration}</div>
            <div className="text-gray-400">seconds</div>
          </div>
        </div>

        {/* Contact Section */}
        <h1 className="text-2xl sm:text-3xl text-gray-500 font-bold">Contact</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-3xl">
          {[
            { icon: <FaLinkedin className="text-5xl sm:text-6xl" />, label: "LinkedIn", link: "https://www.linkedin.com/in/avinash-chaturvedi" },
            { icon: <FaGithub className="text-5xl sm:text-6xl" />, label: "GitHub", link: "https://github.com/avinashchaturvedi2002" },
            { icon: <FaEnvelope className="text-5xl sm:text-6xl" />, label: "Email", link: "mailto:chaturvediavinash2002@gmail.com" },
            { icon: <img src={LeetCodeIcon} alt="LeetCode" className="w-12 h-12 sm:w-16 sm:h-16" />, label: "LeetCode", link: "https://leetcode.com/u/avinashchaturvedi2002/" }
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center p-3 sm:p-4 hover:bg-gray-500 cursor-pointer rounded-md"
              onClick={() => window.open(item.link, "_blank")}
            >
              {item.icon}
              <p className="mt-2 text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>

        <TechStack />
      </div>
    </div>
  );
};

export default AboutPage;