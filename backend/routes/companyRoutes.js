const router = require("express").Router();
const Company = require("../models/Company");


// 🔹 GET COMPANY PROFILE BY USER ID
router.get("/:userId", async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.params.userId })
      .populate("user", "email role");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching company" });
  }
});


// 🔹 UPDATE COMPANY PROFILE
router.put("/update", async (req, res) => {
  try {
    const { user } = req.body;

    const updated = await Company.findOneAndUpdate(
      { user },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating company" });
  }
});


module.exports = router;