const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const Drive = require("../models/Drive");
const User = require("../models/User"); // ✅ only once


// ==============================
// 1. GET all pending companies
// ==============================
router.get("/pending-companies", async (req, res) => {
  try {
    const companies = await Company.find({ approved: false })
      .populate("user", "email role");

    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pending companies" });
  }
});


// ==============================
// 2. APPROVE a company
// ==============================
router.put("/approve-company/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      message: "Company approved successfully",
      company,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving company" });
  }
});


// ==============================
// 3. GET all approved companies
// ==============================
router.get("/approved-companies", async (req, res) => {
  try {
    const companies = await Company.find({ approved: true })
      .populate("user", "email");

    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching approved companies" });
  }
});


// ==============================
// 4. GET all registered students
// ==============================
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email branch");

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching students" });
  }
});


// ==============================
// 5. GET pending drives
// ==============================
router.get("/pending-drives", async (req, res) => {
  try {
    const drives = await Drive.find({ isApproved: false })
      .populate({
        path: "company",
        select: "companyName",
      });

    res.json(drives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching drives" });
  }
});


// ==============================
// 6. APPROVE drive
// ==============================
router.put("/approve-drive/:id", async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    res.json({
      message: "Drive approved",
      drive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving drive" });
  }
});


// ==============================
module.exports = router;