import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";

const TypingTest = ({ user }) => {
  const [selectedTime, setSelectedTime] = useState(30);
  const [wordsString, setWordsString] = useState("");
  const [input, setInput] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [loading, setLoading] = useState(false); // ⬅️ NEW: Loading state
  const inputRef = useRef(null);

  useEffect(() => {
    generateNewWords();
  }, [selectedTime]);

  async function generateNewWords() {
    setLoading(true); // Start loading spinner
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/get-random`);
      const words = await response.json();
      setWordsString(words.join(" "));
    } catch (error) {
      console.error("Error fetching words:", error);
    }
    
    setInput("");
    setCorrectChars(0);
    setTotalTypedChars(0);
    setCurrentIndex(0);
    setTimer(selectedTime);
    setIsRunning(false);
    setTestFinished(false);
    setLoading(false); // Stop loading spinner
  }

  useEffect(() => {
    if (isRunning && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsRunning(false);
      setTestFinished(true);
    }
  }, [isRunning, timer]);

  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
  
    document.addEventListener("click", handleClick);
  
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (testFinished && user) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/save-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          mode: `${selectedTime}s`,
          actualWPM: calculateWPM(),
          accuracy: calculateAccuracy(),
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Result saved"))
        .catch((error) => console.error("Error saving result:", error));
    }
  }, [testFinished, user]);

  function handleInput(e) {
    if (!isRunning) setIsRunning(true);

    const value = e.target.value;
    const lastChar = value[value.length - 1];
    const expectedChar = wordsString[currentIndex];

    if (value.length < input.length) {
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    } else {
      setTotalTypedChars(totalTypedChars + 1);
      if (lastChar === expectedChar) {
        setCorrectChars(correctChars + 1);
      }
      setCurrentIndex(currentIndex + 1);
    }

    setInput(value);
  }

  function calculateWPM() {
    return Math.round((correctChars / 5) / (selectedTime / 60)) || 0;
  }

  function calculateAccuracy() {
    return totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center w-full">
      {/* <NavBar user={user} /> */}
      {testFinished ? (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
          <h1 className="text-4xl font-bold mb-4">Typing Test Results</h1>
          <p className="text-2xl">🔥 WPM: {calculateWPM()}</p>
          <p className="text-2xl">🎯 Accuracy: {calculateAccuracy()}%</p>
          <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md text-lg" onClick={() => {
    generateNewWords();
    setTimeout(() => inputRef.current?.focus(), 100); // Refocus after a short delay
  }}>
            Restart Test
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 bg-gray-800 shadow-md p-4 rounded-md">
            <span className="font-semibold text-lg">Time: </span>
            {[15, 30, 60, 120].map((time) => (
              <button
                key={time}
                className={`mx-2 px-4 py-2 rounded-md font-semibold text-lg ${selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
                onClick={() => {
                  setSelectedTime(time); // No need to call generateNewWords() here
                  setTimeout(() => inputRef.current.focus(), 100);
                }}
              >
                {time}s
              </button>
            ))}
          </div>

          {/* Show Loading Spinner while words are being fetched */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="mt-6 w-3/4 h-40 bg-gray-800 p-4 rounded-md shadow-md text-left text-3xl font-mono overflow-hidden relative">
  <div
    className="absolute transition-transform duration-200"
    style={{
      transform: `translateY(-${Math.max(0, (Math.floor(currentIndex / 70) - 1) * 2.5)}rem)`,
    }}
  >
    {wordsString.split("").map((char, index) => {
      let className = "text-gray-500";
      if (index < currentIndex) {
        className = input[index] === char ? "text-yellow-400" : "text-red-500";
      } else if (index === currentIndex) {
        className = "bg-green-500 text-white animate-blink "; // Cursor effect
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    })}
  </div>
</div>
      )}

          <p className="mt-4 text-xl font-semibold">⏳ Time Left: {timer}s</p>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            autoFocus
            className="absolute opacity-0"
          />
          <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md text-lg" onClick={() => {
    generateNewWords();
    setTimeout(() => inputRef.current?.focus(), 100); // Refocus after a short delay
  }}>
            Restart Test
          </button>
        </>
      )}
    </div>
  );
};

export default TypingTest;
