require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authrouter=require("./Routes/AuthRoutes")
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['https://manit-type-mftz.vercel.app','http://localhost:5179']; // your frontend domain

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if you're using cookies/auth
}));
app.use(express.json());
app.use("/api/v1/user",authrouter)
// Default Route
app.get("/", (req, res) => {
  res.send("Typing Test API is Running 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
