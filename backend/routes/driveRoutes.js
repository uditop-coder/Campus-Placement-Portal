const router = require("express").Router();
const Drive = require("../models/Drive");

// CREATE DRIVE
router.post("/create", async (req, res) => {
  const drive = await Drive.create(req.body);
  res.json(drive);
});

// GET COMPANY DRIVES
router.get("/:companyId", async (req, res) => {
  const drives = await Drive.find({ companyId: req.params.companyId });
  res.json(drives);
});

// GET ALL DRIVES (for students)
router.get("/", async (req, res) => {
  const drives = await Drive.find().populate("companyId");
  res.json(drives);
});

module.exports = router;