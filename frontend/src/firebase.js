import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACDgHltIVcs7Gg0UVAEIHO9XUmKo6y8_8",
  authDomain: "manit-typing-test.firebaseapp.com",
  projectId: "manit-typing-test",
  storageBucket: "manit-typing-test.firebasestorage.app",
  messagingSenderId: "451822875476",
  appId: "1:451822875476:web:80ede1d31b0c68fb17cec1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
