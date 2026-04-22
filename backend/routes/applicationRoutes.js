const router = require("express").Router();

const Application = require("../models/Application");
const Drive = require("../models/Drive");
const Company = require("../models/Company");
const Student = require("../models/Student");
const auth = require("../middleware/authMiddleware");

// 🔐 ROLE CHECK MIDDLEWARES
const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Students only" });
  }
  next();
};

const isCompany = (req, res, next) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Companies only" });
  }
  next();
};



// ==============================
// 🎓 APPLY TO DRIVE (STUDENT)
// ==============================
router.post("/apply", auth, isStudent, async (req, res) => {
  try {
    const { drive } = req.body;

    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(400).json({
        message: "Student profile not found"
      });
    }

    const existing = await Application.findOne({
      student: student._id,
      drive
    });

    if (existing) {
      return res.status(400).json({
        message: "Already applied to this drive"
      });
    }

    const application = await Application.create({
      student: student._id,   // ✅ CORRECT
      drive
    });

    res.json(application);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying" });
  }
});



// ==============================
// 🏢 GET ALL APPLICATIONS (COMPANY)
// ==============================
router.get("/company", auth, isCompany, async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });

    const drives = await Drive.find({ company: company._id });

    const applications = await Application.find({
      drive: { $in: drives.map(d => d._id) }
    })
      .populate("student", "name rollNo branch cgpa resume") // ✅ FIXED
      .populate("drive", "jobTitle");

    res.json(applications);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching applications" });
  }
});



// ==============================
// 🏢 GET APPLICATIONS FOR ONE DRIVE
// ==============================
router.get("/drive/:driveId", auth, isCompany, async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });

    const drive = await Drive.findById(req.params.driveId);

    if (!drive || drive.company.toString() !== company._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({ drive: drive._id })
      .populate("student", "name rollNo");

    res.json(applications);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching drive applications" });
  }
});



// ==============================
// 🏢 UPDATE APPLICATION STATUS
// ==============================
router.put("/update-status/:id", auth, isCompany, async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("drive");

    const company = await Company.findOne({ user: req.user.id });

    // 🔐 SECURITY CHECK
    if (
      !application ||
      application.drive.company.toString() !== company._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = status;

    // optional: track history if field exists
    if (application.statusHistory) {
      application.statusHistory.push({ status });
    }

    await application.save();

    res.json(application);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});



module.exports = router;