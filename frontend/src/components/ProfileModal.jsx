import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ProfileModal = ({ user, onClose }) => {
  const [results, setResults] = useState([]);
  const [selectedMode, setSelectedMode] = useState("30s"); // Default mode

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user || !user.email) return;
        console.log("Fetching profile for user:", user.email);

        const { data } = await axios.get(`http://localhost:5000/api/v1/user/profile/`, {
          params: { email: user.email },
        });
        console.log(data);
        setResults(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [user]);

  const filteredResults = results
    .filter((result) => result.mode === selectedMode)
    .map((result) => ({
      date: new Date(result.timestamp).toLocaleDateString(),
      wpm: result.actualWPM,
    }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-2/3 relative border border-gray-700">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">{user.displayName}'s Profile</h2>

        <div className="mb-4">
          <label className="font-semibold mr-2">Select Mode:</label>
          <select 
            value={selectedMode} 
            onChange={(e) => setSelectedMode(e.target.value)} 
            className="bg-gray-800 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="15s">15s</option>
            <option value="30s">30s</option>
            <option value="60s">60s</option>
            <option value="120s">120s</option>
          </select>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredResults}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="date" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip wrapperClassName="bg-gray-800 text-white p-2 rounded" />
              <Legend wrapperStyle={{ color: "white" }} />
              <Line type="monotone" dataKey="wpm" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
