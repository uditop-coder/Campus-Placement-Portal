const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:admin%40123@cluster0.k4jv87a.mongodb.net/ppa?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🔹 Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/studentRoutes"); // ✅ NEW

app.use("/api/auth", require("./routes/auth"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/drive", require("./routes/driveRoutes"));
app.use("/api/application", require("./routes/applicationRoutes"));
// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));