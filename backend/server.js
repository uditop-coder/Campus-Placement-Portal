const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 🔹 Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/drive", require("./routes/driveRoutes"));
app.use("/api/application", require("./routes/applicationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes")); 

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ❗ GLOBAL ERROR HANDLER (IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));