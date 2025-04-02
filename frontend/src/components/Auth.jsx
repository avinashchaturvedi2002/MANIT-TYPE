import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import googleIcon from "../assets/google.png";
import axios from "axios";

const Auth = ({ setUser }) => {
  const handleAuth = async (isSignin) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;

      if (isSignin) {
        // 🔹 SIGN IN: Check if user exists in DB
        try {
          const response = await axios.post("http://localhost:5000/api/v1/user/signin", { email });
          console.log("Signin Success:", response.data);
          setUser(result.user); // Save user in state
        } catch (error) {
          // 🔴 If user is not found in DB, show alert
          if (error.response && error.response.status === 404) {
            alert("User not found. Please sign up first.");
          } else {
            console.error("Signin Error:", error);
          }
        }
      } else {
        // 🔹 SIGN UP: Ensure email is MANIT's
        if (!email.endsWith("@stu.manit.ac.in")) {
          alert("You can only register with a MANIT email ID.");
          return; // Stop further execution
        }

        try {
          await axios.post("http://localhost:5000/api/v1/user/signup", { name: displayName, email });
          setUser(result.user); // Save user in state
        } catch (error) {
          console.error("Signup Error:", error);
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to MANIT Typing Test</h1>
        <p className="text-gray-600 mb-4">Sign in or Sign up to continue</p>

        {/* SIGN UP BUTTON */}
        <button
          onClick={() => handleAuth(false)}
          className="flex items-center justify-center w-full px-4 py-2 mb-2 text-white bg-green-500 hover:bg-green-600 rounded-md transition"
        >
          <img src={googleIcon} alt="Google Logo" className="w-12 h-12 mr-2" />
          Sign Up with Google
        </button>

        {/* SIGN IN BUTTON */}
        <button
          onClick={() => handleAuth(true)}
          className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-400 hover:bg-blue-600 rounded-md transition"
        >
          <img src={googleIcon} alt="Google Logo" className="w-12 h-12 mr-2" />
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;
