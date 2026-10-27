const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const lostItemRoutes = require("./routes/lostItemRoutes");
const authRoutes = require("./routes/auth");
const foundItemRoutes = require("./routes/foundItemRoutes");
const matchRoutes = require("./routes/matchRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);
app.use("/api/matches", matchRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("CampusFind Backend is Running!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error:", error.message);
  });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
