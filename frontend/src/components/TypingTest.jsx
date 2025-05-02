import React, { useState, useEffect, useRef, useMemo } from "react";
import NavBar from "./NavBar";

const TypingTest = ({ user }) => {
  const scrollRef = useRef(null);
  const cursorRef = useRef(null);
  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  const [selectedTime, setSelectedTime] = useState(30);
  const [wordsArray, setWordsArray] = useState([]);
  const [typedWords, setTypedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateNewWords();
  }, [selectedTime]);

  async function generateNewWords() {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/get-random`);
      const words = await response.json();
      setWordsArray(words);
    } catch (error) {
      console.error("Error fetching words:", error);
    }

    setTypedWords([]);
    setCurrentWord("");
    setCorrectChars(0);
    setTotalTypedChars(0);
    setTestFinished(false);
    setTimer(selectedTime);
    setLoading(false);
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setTestFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
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
          accuracy: calculateAccuracy()
        })
      });
    }
  }, [testFinished, user]);

  useEffect(() => {
    let correct = 0;
    let total = 0;

    typedWords.forEach((typed, idx) => {
      const expected = wordsArray[idx] || "";
      const minLen = Math.min(typed.length, expected.length);
      total += expected.length;

      for (let i = 0; i < minLen; i++) {
        if (typed[i] === expected[i]) correct++;
      }
    });

    if (currentWord !== "") {
      const currentIdx = typedWords.length;
      const expected = wordsArray[currentIdx] || "";
      const minLen = Math.min(currentWord.length, expected.length);
      total += currentWord.length;

      for (let i = 0; i < minLen; i++) {
        if (currentWord[i] === expected[i]) correct++;
      }
    }

    setCorrectChars(correct);
    setTotalTypedChars(total);
  }, [typedWords, currentWord, wordsArray]);

  function handleInput(e) {
    const value = e.target.value;
    if (!isRunning) setIsRunning(true);

    const split = value.trim().split(" ");
    const endsWithSpace = value.endsWith(" ");
    const newTypedWords = endsWithSpace ? [...split] : split.slice(0, -1);
    const newCurrentWord = endsWithSpace ? "" : split[split.length - 1];

    setTypedWords(newTypedWords);
    setCurrentWord(newCurrentWord);

    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function calculateWPM() {
    return Math.round((correctChars / 5) / (selectedTime / 60)) || 0;
  }

  function calculateAccuracy() {
    return totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
  }

  const renderedWords = useMemo(() => {
    return wordsArray.map((word, index) => {
      const typed = typedWords[index];
      const isActive = index === typedWords.length;
      const isTyped = index < typedWords.length;

      let wordClasses = "mr-2";
      if (isTyped && typed !== word) wordClasses += " border-b-2 border-red-500";

      return (
        <span key={index} className={wordClasses}>
          {word.split("").map((char, i) => {
            let charClass = "text-gray-500";
            if (isTyped) {
              charClass = typed[i] === char ? "text-yellow-400" : "text-red-500";
            } else if (isActive) {
              const typedChar = currentWord[i];
              if (typedChar !== undefined) {
                charClass = typedChar === char ? "text-yellow-400" : "text-red-500";
              }
            }
            const isCursor = isActive && i === currentWord.length;
            const ref = isCursor ? cursorRef : null;
            return (
              <span key={i} className="relative" ref={ref}>
                {isCursor && (
                  <span className="absolute -left-1 top-0 h-full w-0.5 bg-green-500 animate-pulse"></span>
                )}
                <span className={charClass}>{char}</span>
              </span>
            );
          })}
        </span>
      );
    });
  }, [wordsArray, typedWords, currentWord]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center w-full px-4">
      {testFinished ? (
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Typing Test Results</h1>
          <p className="text-3xl">🔥 WPM: {calculateWPM()}</p>
          <p className="text-2xl">🎯 Accuracy: {calculateAccuracy()}%</p>
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md text-lg"
            onClick={() => {
              generateNewWords();
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            Restart Test
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 w-full max-w-4xl flex flex-wrap justify-center gap-2 sm:gap-4 text-center">
            <span className="font-semibold text-lg w-full text-center">Time:</span>
            {[15, 30, 60, 120].map(time => (
              <button
                key={time}
                className={`min-w-[4rem] sm:min-w-[5rem] px-3 py-2 sm:px-4 sm:py-2 rounded-md font-semibold text-sm sm:text-base md:text-lg ${selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
                onClick={() => {
                  setSelectedTime(time);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
              >
                {time}s
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div
              className="mt-6 w-10/12 h-40 text-left text-4xl font-mono overflow-hidden leading-normal tracking-wide flex flex-wrap"
              style={{ scrollBehavior: "smooth" }}
              ref={scrollRef}
            >
              {renderedWords}
            </div>
          )}

          <p className="mt-4 text-xl font-semibold">⏳ Time Left: {timer}s</p>
          <input
            ref={inputRef}
            type="text"
            value={[...typedWords, currentWord].join(" ")}
            onChange={handleInput}
            autoFocus
            className="absolute opacity-0"
          />
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md text-lg"
            onClick={() => {
              generateNewWords();
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            Restart Test
          </button>
        </>
      )}
    </div>
  );
};

export default TypingTest;
