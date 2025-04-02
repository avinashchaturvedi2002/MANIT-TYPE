import React from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import googleIcon from "../assets/google.png"; // Adjust path if needed

const Signup = ({ setUser }) => {
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email.endsWith("@stu.manit.ac.in")) {
        alert("Only MANIT students can sign up!");
        return;
      }

      // Send user details to backend for signup
      const response = await fetch("http://localhost:5000/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.displayName, email: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome to MANIT Typing Test
        </h2>
        <p className="text-gray-600 mb-6">
          Sign up with your college email to get started.
        </p>
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center  w-full px-4 py-2 text-white bg-blue-300 hover:bg-blue-600 rounded-md transition"
        >
          <img 
            src={googleIcon}
            alt="Google Logo"
            className="w-12 h-12 mr-2 "
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
