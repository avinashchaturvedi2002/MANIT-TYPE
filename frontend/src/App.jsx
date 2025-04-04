import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./index.css"; 
import Auth from "./components/Auth";
import TypingTest from "./components/TypingTest";
import NavBar from "./components/NavBar";
import Leaderboard from "./components/Leaderboard";
import AboutPage from "./components/AboutPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {user && <NavBar user={user} setUser={setUser} />} {/* ✅ Show NavBar only if user exists */}
        
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
