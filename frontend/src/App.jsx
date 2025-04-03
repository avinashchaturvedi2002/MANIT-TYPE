import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";  // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth"; // Import session listener
import "./index.css"; 
import Auth from "./components/Auth";
import TypingTest from "./components/TypingTest";
import Leaderboard from "./components/Leaderboard";
import AboutPage from "./components/AboutPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // 🔹 Listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once auth state is known
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={user ? <TypingTest user={user} /> : <Auth setUser={setUser} />} />
          <Route path="/leaderboard" element={user ? <Leaderboard user={user} /> : <Auth setUser={setUser} />} />
          <Route path="/about" element={user ? <AboutPage user={user} /> : <Auth setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
