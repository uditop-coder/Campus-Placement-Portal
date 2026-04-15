const router = require("express").Router();
const Application = require("../models/Application");

// 🔹 APPLY TO DRIVE
router.post("/apply", async (req, res) => {
  try {
    const { student, drive } = req.body;

    // 🔥 Prevent duplicate applications
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


// 🔹 GET ALL APPLICATIONS
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
    console.error(err);
    res.status(500).json({ message: "Error fetching applications" });
  }
});


// 🔹 UPDATE APPLICATION STATUS (COMPANY ACTION)
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = router;