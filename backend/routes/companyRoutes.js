const router = require("express").Router();
const Company = require("../models/Company");

// GET
router.get("/:userId", async (req, res) => {
  const data = await Company.findOne({ userId: req.params.userId });
  res.json(data);
});

// UPDATE
router.post("/update", async (req, res) => {
  const { userId } = req.body;

  const data = await Company.findOneAndUpdate(
    { userId },
    req.body,
    { new: true, upsert: true }
  );

  res.json(data);
});

module.exports = router;