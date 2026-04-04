import express from "express";
import Student from "../models/Student.js";
import multer from "multer";

const router = require("express").Router();
const Student = require("../models/Student");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET
router.get("/:userId", async (req, res) => {
  const data = await Student.findOne({ userId: req.params.userId });
  res.json(data);
});

// UPDATE
router.post("/update", async (req, res) => {
  const { userId } = req.body;

  const data = await Student.findOneAndUpdate(
    { userId },
    req.body,
    { new: true, upsert: true }
  );

  res.json(data);
});

// UPLOAD RESUME
router.post("/upload", upload.single("resume"), async (req, res) => {
  const { userId } = req.body;

  const data = await Student.findOneAndUpdate(
    { userId },
    { resume: req.file.filename },
    { new: true }
  );

  res.json(data);
});

module.exports = router;