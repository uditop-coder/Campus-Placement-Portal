const router = require("express").Router();
const Company = require("../models/Company");
const auth = require("../middleware/authMiddleware");



// 🔹 GET MY COMPANY PROFILE
router.get("/me", auth, async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id })
      .populate("user", "email role");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Error fetching company" });
  }
});


// 🔹 UPDATE PROFILE
router.put("/update", auth, async (req, res) => {
  try {
    const updated = await Company.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating company" });
  }
});

module.exports = router;