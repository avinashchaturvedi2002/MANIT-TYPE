import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaReact, FaNodeJs, FaDatabase, FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import NavBar from "./NavBar";
import LeetCodeIcon from "../assets/lc.svg";
import TechStack from "./TechStack";
const AboutPage = ({user}) => {
  const [stats, setStats] = useState({ totalTests: 0, totalTimeHours: 0 });

  useEffect(() => {
    // Fetch stats from the backend
    fetch("http://localhost:5000/api/v1/user/stats/") 
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    < div className="flex w-full flex-col">
      <NavBar user={user}/>
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 w-full space-y-8">
     
      <h1 className="text-4xl font-bold mb-4">About This Platform</h1>
      <p className="text-lg mb-6">
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
      <h1 className="text-3xl text-gray-500 font-bold">Statistics</h1>
      <div className="flex w-2/3 justify-around">
        <div className="text-lg bg-gray-800 p-4 rounded-lg flex flex-col justify-center items-center w-96 h-40"> 
          <div className="text-gray-400">Total Typing Tests</div>
          <div className="text-6xl">{stats.totalTests}</div> 
          <div className="text-gray-400">{1000-stats.totalTests} to reach 1000</div>
        </div>
        <div className="text-lg bg-gray-800 p-4 rounded-lg flex flex-col justify-center items-center w-96"> 
          <div className="text-gray-400">Total Typing Time</div>
          <div className="text-6xl">{stats.duration}</div> 
          <div className="text-gray-400">seconds</div>
        </div>
      </div>
      
      <h1 className="text-3xl text-gray-500 font-bold">Contact</h1>
        <div className="text-lg w-2/3 bg-gray-800 py-12 rounded-lg flex justify-around  items-center  "> 
        
        <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer"  onClick={() => window.open("https://www.linkedin.com/in/avinash-chaturvedi", "_blank")}>
        <FaLinkedin className="text-9xl" /><p>LinkedIn</p>
        </div>
        <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.open("https://github.com/avinashchaturvedi2002", "_blank")}>
        <FaGithub className="text-9xl" /><p>GitHub</p>
        </div>
        <div className="flex flex-col justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer" onClick={() => window.location.href = "mailto:chaturvediavinash2002@gmail.com"}>
        <FaEnvelope className="text-9xl" /><p>Email</p>
        </div>
        <div className="flex flex-col text-white justify-center items-center rounded p-4 hover:bg-gray-500 cursor-pointer w-40"
          onClick={() => window.open("https://leetcode.com/u/avinashchaturvedi2002/", "_blank")}
        >
          <img src={LeetCodeIcon} alt="LeetCode" className="w-24 h-24" />
          <p className="mt-6">LeetCode</p>
        </div>
      
        </div>
        
    <TechStack/>

    </div>
    </div>
    
  );
};

export default AboutPage;
