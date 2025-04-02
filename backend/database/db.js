require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully ✅"))
  .catch(err => console.error("MongoDB Connection Error ❌", err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  highestWPM: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mode: { type: String, enum: ["15s", "30s", "60s", "120s"], required: true },
  actualWPM: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", resultSchema);


const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mode: { type: String, enum: ["15s", "30s", "60s", "120s"], required: true },
  bestWPM: { type: Number, required: true }, // Only storing actual WPM
  updatedAt: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

const notificationSchema = new mongoose.Schema({
  message: String,
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track users who read it
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports={User,Result,Leaderboard,Notification}
