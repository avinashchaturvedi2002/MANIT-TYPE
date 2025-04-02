import React, { useState, useEffect, useRef } from "react";
import { FaTrophy, FaInfoCircle, FaBell, FaUserCircle } from "react-icons/fa";
import NavBar from "./NavBar"
const TypingTest = ({ user }) => {
  // console.log(user);
  const [selectedTime, setSelectedTime] = useState(30);
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    generateNewWords();
  }, [selectedTime]);

  function generateNewWords() {
    const wordList = ["code", "developer", "keyboard", "speed", "test", "accuracy", "javascript", "react", "firebase"];
    const newWords = Array.from({ length: 20 }, () => wordList[Math.floor(Math.random() * wordList.length)]);
    setWords(newWords);
    setInput("");
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setCorrectChars(0);
    setTotalTypedChars(0);
    setTimer(selectedTime);
    setIsRunning(false);
    setTestFinished(false);
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
    if (testFinished && user) {
      
      fetch("http://localhost:5000/api/v1/user/save-result", { // Adjust URL as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email, // Ensure user object has `_id`
          mode: `${selectedTime}s`, // Example mode
          actualWPM: calculateWPM(),
          accuracy: calculateAccuracy(),
        }),
      })
      .then(response => response.json())
      .then(data => console.log("Result saved:", data))
      .catch(error => console.error("Error saving result:", error));
    }
  }, [testFinished, user]);
  
  function handleInput(e) {
    if (!isRunning) {
      setIsRunning(true);
    }

    const value = e.target.value;
    
    if (!(value.endsWith(" ")))
    setTotalTypedChars((prev) => prev + 1);

    if (value.endsWith(" ")) {
      checkWord(value.trim());
      setInput("");
    } else {
      setInput(value);
    }
  }

  function checkWord(typedWord) {
    const currentWord = words[currentWordIndex];
    if (typedWord === currentWord) {
      setCorrectWords(correctWords + 1);
    }
    let correctCount = 0;
    for (let i = 0; i < typedWord.length; i++) {
      if (typedWord[i] === currentWord[i]) correctCount++;
    }
    setCorrectChars(correctChars + correctCount);
    setCurrentWordIndex(currentWordIndex + 1);
  }

  function calculateWPM() {
    // console.log(correctChars);
    return Math.round((correctChars / 5) / (selectedTime / 60)) || 0;
  }

  function calculateAccuracy() {
    console.log(correctChars);
    console.log(totalTypedChars);
    return totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
  }

  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center w-full">
      <NavBar user={user}/>
      {testFinished?(<div className="flex flex-col w-full">
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Typing Test Results</h1>
        <p className="text-2xl">🔥 WPM: {calculateWPM()}</p>
        <p className="text-2xl">🎯 Accuracy: {calculateAccuracy()}%</p>
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md text-lg" onClick={generateNewWords}>
          Restart Test
        </button>
      </div>
    </div>):(<><div className="mt-4 bg-gray-800 shadow-md p-4 rounded-md">
        <span className="font-semibold text-lg">Time: </span>
        {[15, 30, 60, 120].map((time) => (
          <button
            key={time}
            className={`mx-2 px-4 py-2 rounded-md font-semibold text-lg ${selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
            onClick={() => {
              setSelectedTime(time);
              generateNewWords();
              setTimeout(() => inputRef.current.focus(), 100); // Refocus input after update
            }}
            
          >
            {time}s
          </button>
        ))}
      </div>

      <div className="mt-6 w-3/4 bg-gray-800 p-8 rounded-md shadow-md text-center text-3xl font-mono">
        <div className="flex flex-wrap justify-center">
          {words.map((word, index) => (
            <span key={index} className="mr-6">
              {word.split("").map((letter, i) => {
                let className = "text-gray-500";
                if (index === currentWordIndex) {
                  if (input[i] === undefined) {
                    className = "text-gray-500";
                  } else if (input[i] === letter) {
                    className = "text-yellow-400";
                  } else {
                    className = "text-red-500";
                  }
                }
                return (
                  <span key={i} className={className}>
                    {letter}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xl font-semibold">⏳ Time Left: {timer}s</p>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        autoFocus
        className="absolute opacity-0"
      /></>)}
      
    </div>
  );
};

export default TypingTest;
