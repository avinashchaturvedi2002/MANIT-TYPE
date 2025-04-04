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
  const [verifiedUser, setVerifiedUser] = useState(null); // ⬅️ Only set this after backend confirms
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // 🔹 Check if the user exists in DB
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/signin`, { email: currentUser.email });
          setVerifiedUser(currentUser); // ✅ Only set if backend confirms
        } catch (error) {
          await signOut(auth); // 🚀 Sign out immediately if not in DB
          setVerifiedUser(null); 
        }
      } else {
        setVerifiedUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
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
          <Route path="/" element={verifiedUser ? <TypingTest user={verifiedUser} /> : <Auth setUser={setUser} />} />
          <Route path="/leaderboard" element={verifiedUser ? <Leaderboard user={verifiedUser} /> : <Auth setUser={setUser} />} />
          <Route path="/about" element={verifiedUser ? <AboutPage user={verifiedUser} /> : <Auth setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
