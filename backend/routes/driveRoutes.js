const router = require("express").Router();
const Drive = require("../models/Drive");
const Company = require("../models/Company");
const auth = require("../middleware/authMiddleware");


// 🔹 CREATE DRIVE (ONLY APPROVED COMPANY)
router.post("/create", auth, async (req, res) => {
  console.log("CREATE DRIVE HIT"); // 👈 ADD HERE

  try {
    const company = await Company.findOne({ user: req.user.id });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (!company.approved) {
      return res.status(403).json({ message: "Company not approved" });
    }

    const drive = await Drive.create({
      ...req.body,
      company: company._id,
      isApproved: false
    });

    res.json(drive);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating drive" });
  }
});


// 🔹 GET MY DRIVES (SECURE)
router.get("/my-drives", auth, async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });

    const drives = await Drive.find({ company: company._id });

    res.json(drives);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching drives" });
  }
});


// 🔹 GET ALL DRIVES (FOR STUDENTS)
router.get("/", async (req, res) => {
  try {
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