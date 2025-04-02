import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const Leaderboard = ({user}) => {
  const [mode, setMode] = useState("30s"); // Default mode
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/v1/user/leaderboard/`, {
        params: { mode: mode !== "all" ? mode : undefined } // Send mode only if not "all"
      });
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [mode]);

  return (
    <div className="flex flex-col w-full bg-gray-900 text-gray-500">
      <NavBar  user={user}/>
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>

        {/* Mode Selection */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="15s">15s</option>
          <option value="30s">30s</option>
          <option value="60s">60s</option>
          <option value="120s">120s</option>
        </select>

        {/* Leaderboard Table */}
        <table className="mt-4 border-collapse border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Rank</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">WPM</th>
              <th className="border px-4 py-2">Mode</th> {/* Added Mode Column */}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id} className="border-b">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{entry.userId.name}</td>
                <td className="border px-4 py-2">{entry.bestWPM} WPM</td>
                <td className="border px-4 py-2">{entry.mode}</td> {/* Display Mode */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
