const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ==============================
   MIDDLEWARE
============================== */
app.use(cors());
app.use(express.json());

/* ==============================
   STATIC FILES (UPLOADS)
============================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==============================
   DATABASE CONNECTION
============================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* ==============================
   ROUTES IMPORT
============================== */
const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/companyRoutes");
const studentRoutes = require("./routes/studentRoutes");
const driveRoutes = require("./routes/driveRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");

/* ==============================
   ROUTES USAGE
============================== */
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/admin", adminRoutes);

/* ==============================
   TEST ROUTE
============================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ==============================
   GLOBAL ERROR HANDLER
============================== */
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

/* ==============================
   SERVER START
============================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});