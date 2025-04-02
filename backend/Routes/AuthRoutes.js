require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const { User,Result,Leaderboard ,Notification,Words} = require("../database/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email } = req.body;

  // Ensure only MANIT students can sign up
  // if (!email.endsWith("@stu.manit.ac.in")) {
  //   return res.status(400).json({ message: "Only MANIT students can sign up." });
  // }

  try {
    let user = await User.findOne({ email });

    // If user already exists, return a message
    if (user) {
      return res.status(400).json({ message: "User already registered." });
    }

    // Create new user
    user = new User({ name, email });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d", // Token valid for 7 days
    });

    res.status(201).json({ message: "Signup successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/signin", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/save-result", async (req, res) => {
  try {
    const { email, mode, actualWPM, accuracy } = req.body;
    const user=await User.findOne({email:email})
    const userId=user._id
    if (!userId || !mode || actualWPM == null || accuracy == null) {
    
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the result
    const newResult = await Result.create({ userId, mode, actualWPM, accuracy });

    // Update leaderboard if the new score is higher
    const existingEntry = await Leaderboard.findOne({ userId, mode });

    if (!existingEntry || actualWPM > existingEntry.bestWPM) {
      await Leaderboard.findOneAndUpdate(
        { userId, mode },
        { bestWPM: actualWPM, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ message: "Result saved successfully", result: newResult });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  const { mode, name } = req.query;

  try {
    let leaderboard;

    if (mode && mode !== "all") {
      leaderboard = await Leaderboard.find({ mode })
        .populate("userId", "name email")
        .sort({ bestWPM: -1 });
    } else {
      // Fetch best WPM per user per mode
      leaderboard = await Leaderboard.find({})
        .populate("userId", "name email")
        .sort({ bestWPM: -1 });
    }

    if (name) {
      const regex = new RegExp(name, "i");
      leaderboard = leaderboard.filter(entry => regex.test(entry.userId.name));
    }

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leaderboard", details: error });
  }
});


router.get("/profile", async (req, res) => {
  const { email } = req.query;
  try {
    // Fetch results sorted by timestamp
    const userquery=await User.find({email:email})
    const userId=userquery[0]._id;
    const results = await Result.find({ userId })
      .sort({ timestamp: 1 }) // Ascending order (oldest first)
      .select("mode actualWPM timestamp -_id");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile data", details: error });
  }
});

router.get("/notifications", async (req, res) => { 
  try {
    const { email } = req.query;
    const userquery=await User.find({email:email})
    const userId=userquery[0]._id;
    const notifications = await Notification.find({ readBy: { $ne: userId } }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

// Add a new notification
router.post("/notifications", async (req, res) => {
  try {
    const { message } = req.body;
    const newNotification = new Notification({ message });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: "Error adding notification" });
  }
});

// Mark notification as read
router.put("/notifications/:id", async (req, res) => {
  try {
    const { email} = req.body; // Get userId from the request body
    const userquery=await User.find({email:email})
    const userId=userquery[0]._id;
    await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: userId } }); 
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating notification" });
  }
});


const getDurationFromMode = (mode) => {
  const timeModes = { "15s": 15, "30s": 30, "60s": 60, "120s": 120 };
 
  
   return timeModes[mode]||0;
};

// API to get total tests and cumulative duration
router.get("/stats", async (req, res) => {
  try {
    const totalTests = await Result.countDocuments();
    const results = await Result.find({}, "mode");
    // const totalDuration = results.reduce((sum, result) => {sum + getDurationFromMode(result.mode), 0});
    let duration=0;
    for(let i=0;i<results.length;i++)
    {
      
      duration+=parseInt(getDurationFromMode(results[i].mode));
    }

    res.json({ totalTests, duration });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-random", async (req, res) => {
  try {
    const words = await Words.aggregate([{ $sample: { size: 800 } }]); // Get 800 random words
    res.json(words.map((word) => word.text));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch words" });
  }
});
module.exports = router;
