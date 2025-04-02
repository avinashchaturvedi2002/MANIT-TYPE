const mongoose = require("mongoose");
const fs = require("fs");
const {Words} = require("./database/db"); // Import the Word model

const filePath="E:\web dev\projects\MANIT-TYPE\backend\words.txt"
// MongoDB connection


// Function to read words from a file
const getWordsFromFile = (filePath) => {
  return fs.readFileSync(filePath, "utf-8").split("\n").map(word => word.trim()).filter(word => word.length);
};

// Function to generate random words (fallback)
const generateRandomWords = (count) => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const words = new Set();
  while (words.size < count) {
    let word = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    words.add(word);
  }
  return Array.from(words);
};

// Insert words into the database
const insertWords = async () => {
  try {
    let words = [];
    
    // Use words from file if available
    if (fs.existsSync("words.txt")) {
      words = getWordsFromFile("words.txt");
    } else {
      console.log("No words.txt file found, generating random words...");
      words = generateRandomWords(10000);
    }

    // Insert words into database
    await Words.insertMany(words.map(text => ({ text })));
    console.log("✅ Successfully inserted words into the database!");
  } catch (error) {
    console.error("❌ Error inserting words:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
insertWords();
