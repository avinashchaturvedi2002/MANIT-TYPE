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
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/signin`, { email });
          console.log("Signin Success:", response.data);
          setUser(result.user);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert("User not found. Please sign up first.");
          } else {
            console.error("Signin Error:", error);
          }
        }
      } else {
        // 🔹 SIGN UP: Ensure email is MANIT's
        // if (!email.endsWith("@stu.manit.ac.in")) {
        //   alert("You can only register with a MANIT email ID.");
        //   return;
        // }

        try {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/signup`, { name: displayName, email });
          setUser(result.user);
        } catch (error) {
          console.error("Signup Error:", error);
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center border border-gray-700 w-96">
        <h1 className="text-3xl font-bold mb-4 text-green-400">MANIT Typing Test</h1>
        <p className="text-gray-400 mb-6">Sign in or Sign up to continue</p>

        {/* SIGN UP BUTTON */}
        <button
          onClick={() => handleAuth(false)}
          className="flex items-center justify-center w-full px-4 py-3 mb-3 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 hover:shadow-lg transition-all duration-200"
        >
          <img src={googleIcon} alt="Google Logo" className="w-6 h-6 mr-2" />
          <span className="font-semibold">Sign Up with Google</span>
        </button>

        {/* SIGN IN BUTTON */}
        <button
          onClick={() => handleAuth(true)}
          className="flex items-center justify-center w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 hover:shadow-lg transition-all duration-200"
        >
          <img src={googleIcon} alt="Google Logo" className="w-6 h-6 mr-2" />
          <span className="font-semibold">Sign In with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;
