const router = require("express").Router();
const Application = require("../models/Application");

// 🔹 APPLY TO DRIVE
router.post("/apply", async (req, res) => {
  try {
    const { student, drive } = req.body;

    const existing = await Application.findOne({ student, drive });
    if (existing) {
      return res.status(400).json({
        message: "You have already applied to this drive"
      });
    }

    const application = await Application.create(req.body);
    res.json(application);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying to drive" });
  }
});

// 🔹 GET ALL APPLICATIONS (ADMIN)
router.get("/", async (req, res) => {
  try {
    const data = await Application.find()
      .populate("student", "name rollNo")
      .populate({
        path: "drive",
        populate: { path: "company", select: "companyName" }
      });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});

// 🔥 NEW ROUTE
router.get("/company/:companyId", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "drive",
        match: { company: req.params.companyId }
      })
      .populate("student", "name rollNo");

    const filtered = applications.filter(app => app.drive !== null);

    res.json(filtered);

  } catch (err) {
    res.status(500).json({ message: "Error fetching company applications" });
  }
});

// 🔹 UPDATE STATUS
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = router;