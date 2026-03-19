const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:admin%40123@cluster0.k4jv87a.mongodb.net/ppa?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));