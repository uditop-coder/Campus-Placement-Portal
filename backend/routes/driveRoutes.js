const router = require("express").Router();
const Drive = require("../models/Drive");
const Company = require("../models/Company");


// 🔹 CREATE DRIVE (ONLY APPROVED COMPANY)
router.post("/create", async (req, res) => {
  try {
    const { company } = req.body;

    const companyData = await Company.findById(company);

    if (!companyData) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (!companyData.approved) {
      return res.status(403).json({ message: "Company not approved" });
    }

    // 🔥 NEW: drive starts as NOT approved
    const drive = await Drive.create({
      ...req.body,
      isApproved: false
    });

    res.json(drive);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating drive" });
  }
});


// 🔹 GET DRIVES BY COMPANY
router.get("/company/:companyId", async (req, res) => {
  try {
    const drives = await Drive.find({ company: req.params.companyId });

    res.json(drives);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching company drives" });
  }
});


// 🔹 GET ALL DRIVES (FOR STUDENTS)
router.get("/", async (req, res) => {
  try {
    // 🔥 ONLY APPROVED DRIVES
    const drives = await Drive.find({
      isOpen: true,
      isApproved: true
    }).populate("company", "companyName");

    res.json(drives);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching drives" });
  }
});


module.exports = router;