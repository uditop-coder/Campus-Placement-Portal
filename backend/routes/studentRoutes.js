const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Company = require("../models/Company");
const authMiddleware = require("../middleware/authMiddleware");


const multer = require("multer");


// ==============================
// MULTER CONFIG FOR RESUME UPLOAD
// ==============================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ==============================
// GET APPROVED COMPANIES
// ==============================
router.get("/companies/all", async (req, res) => {
  try {
    const companies = await Company.find({ approved: true })
      .select("companyName description");

    res.json(companies);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching companies" });
  }
});


// ==============================
// GET LOGGED-IN STUDENT PROFILE
// ==============================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user.id });

    if (!student) {
      student = await Student.create({
        user: req.user.id,
        name: "New Student"
      });
    }

    student = await student.populate("user", "email role");

    res.json(student);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching student profile"
    });
  }
});


// ==============================
// UPDATE STUDENT PROFILE
// ==============================
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Profile updated successfully",
      student: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating profile"
    });
  }
});

// ==============================
// UPLOAD RESUME
// ==============================
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const updated = await Student.findOneAndUpdate(
        { user: req.user.id },
        { resume: req.file.filename },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      res.json({
        message: "Resume uploaded successfully",
        student: updated
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error uploading resume"
      });
    }
  }
);


module.exports = router;