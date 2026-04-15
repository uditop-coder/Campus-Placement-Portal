const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const multer = require("multer");

// 🔥 Multer Config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// 🔹 GET STUDENT PROFILE
router.get("/:userId", async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.userId })
      .populate("user", "email role");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching student profile" });
  }
});


// 🔹 UPDATE STUDENT PROFILE
router.put("/update", async (req, res) => {
  try {
    const { user } = req.body;

    const updated = await Student.findOneAndUpdate(
      { user },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});


// 🔹 UPLOAD RESUME
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const { user } = req.body;

    const updated = await Student.findOneAndUpdate(
      { user },
      { resume: req.file.filename },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading resume" });
  }
});


module.exports = router;