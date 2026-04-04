const router = require("express").Router();
const Application = require("../models/Application");

// APPLY
router.post("/apply", async (req, res) => {
  const app = await Application.create(req.body);
  res.json(app);
});

// GET ALL
router.get("/", async (req, res) => {
  const data = await Application.find()
    .populate("studentId")
    .populate("companyId")
    .populate("driveId");

  res.json(data);
});

// UPDATE STATUS
router.post("/update", async (req, res) => {
  const { id, status } = req.body;

  const updated = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;