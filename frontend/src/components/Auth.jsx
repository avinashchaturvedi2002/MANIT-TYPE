import { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
import googleIcon from "../assets/google.png";
import axios from "axios";

const Auth = ({ setUser }) => {
  const [loading, setLoading] = useState(false); // ⬅️ NEW: Loading state

  const handleAuth = async (isSignin) => {
    setLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;
  
      if (isSignin) {
        // 🔹 SIGN IN: Check if user exists in DB
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/signin`, { email });
          setUser(result.user);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            await signOut(auth)
            alert("User not found. Please sign up first.");
          } else {
            console.error("Signin Error:", error);
          }
          setLoading(false); // Stop loading on error
        }
      } else {
        // 🔹 SIGN UP: Ensure email is MANIT's
        if (!email.endsWith("@stu.manit.ac.in")) {  
          alert("You can only register with a MANIT email ID.");  
          
          await signOut(auth); // ⬅️ NEW: Logs out non-MANIT users immediately**
          
          setLoading(false); // Stop loading  
          return;
        }
  
        try {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/signup`, { name: displayName, email });
          setUser(result.user);
        } catch (error) {
          console.error("Signup Error:", error);
          setLoading(false); // Stop loading on error
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setLoading(false); // Stop loading on error
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 text-white">
      {loading ? ( // ⬅️ Show loading spinner
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-400">Authenticating...</p>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-gray-700 w-96">
          <h1 className="text-3xl font-bold mb-4 text-green-400">MANIT Typing Test</h1>
          <p className="text-gray-400 mb-6">Sign in or Sign up to continue</p>

          {/* SIGN UP BUTTON */}
          <button
            onClick={() => handleAuth(false)}
            disabled={loading}
            className={`flex items-center justify-center w-full px-4 py-3 mb-3 rounded-lg transition-all duration-200 ${
              loading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600 hover:shadow-lg text-white border border-gray-600"
            }`}
          >
            <img src={googleIcon} alt="Google Logo" className="w-6 h-6 mr-2" />
            <span className="font-semibold">Sign Up with Google</span>
          </button>

          {/* SIGN IN BUTTON */}
          <button
            onClick={() => handleAuth(true)}
            disabled={loading}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
              loading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600 hover:shadow-lg text-white border border-gray-600"
            }`}
          >
            <img src={googleIcon} alt="Google Logo" className="w-6 h-6 mr-2" />
            <span className="font-semibold">Sign In with Google</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
