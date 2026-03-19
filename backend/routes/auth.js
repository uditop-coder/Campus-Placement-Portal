const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: role === "student" ? true : false // companies need approval
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // check approval (for company)
    if (user.role === "company" && !user.isApproved) {
      return res.status(403).json({ message: "Company not approved yet" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;