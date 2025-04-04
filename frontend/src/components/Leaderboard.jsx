import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const Leaderboard = ({ user }) => {
  const [mode, setMode] = useState("30s"); // Default mode
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/leaderboard`, {
        params: {
          mode: mode !== "all" ? mode : undefined,
        },
      });
      
      const rankedLeaderboard = data.map((entry, index) => ({
        ...entry,
        actualRank: index + 1,
      }));

      setLeaderboard(rankedLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [mode]);

  const filteredLeaderboard = leaderboard.filter((entry) => {
    if (!entry.userId || !entry.userId.name) {
      console.warn("Skipping entry due to missing user info:", entry);
      return false;
    }
  
    return entry.userId.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full bg-gray-900 text-gray-500 min-h-screen">
      {/* <NavBar user={user} /> */}
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Leaderboard</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border p-2 rounded bg-gray-800 text-white w-full md:w-auto"
          >
            <option value="all">All</option>
            <option value="15s">15s</option>
            <option value="30s">30s</option>
            <option value="60s">60s</option>
            <option value="120s">120s</option>
          </select>

          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded bg-gray-800 text-white w-full md:w-auto"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="mt-4 border-collapse border w-full text-white min-w-[500px]">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border px-4 py-2">Rank</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">WPM</th>
                <th className="border px-4 py-2">Mode</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((entry, index) => (
                <tr
                  key={`${entry.userId?._id || entry.name}-${entry.mode || "all"}-${index}`}
                  className={`border-b ${entry.actualRank === 1 ? "bg-yellow-300 text-black font-bold" : "bg-gray-800"}`}
                >
                  <td className="border px-4 py-2 text-center">{entry.actualRank}</td>
                  <td className="border px-4 py-2">{entry.userId.name}</td>
                  <td className="border px-4 py-2">{entry.bestWPM} WPM</td>
                  <td className="border px-4 py-2">{entry.mode || "All"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
