const User = require("../models/User");
const Company = require("../models/Company");
const Student = require("../models/Student");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔹 REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      branch,
      section,
      rollNo,
      description,
      managerName,
      companyName
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create USER
    const user = new User({
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // 🎓 STUDENT
    if (role === "student") {
      await Student.create({
        user: user._id,
        name,
        branch,
        section,
        rollNo
      });
    }

    // 🏢 COMPANY
    if (role === "company") {
      await Company.create({
        user: user._id,
        companyName,
        description,
        managerName
      });
    }

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};


// 🔹 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 🔥 ADMIN HARDCODE
    if (
      role === "admin" &&
      email?.trim() === "admin@ppa.com" &&
      password === "admin123"
    ) {
      return res.json({
        message: "Admin login successful",
        role: "admin",
        token: "admin-token",
        id: "admin-id" // 🔥 ADD THIS
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔥 COMPANY APPROVAL CHECK
    if (user.role === "company") {
      const company = await Company.findOne({ user: user._id });

      if (!company) {
        return res.status(400).json({ message: "Company profile not found" });
      }

      if (!company.approved) {
        return res.status(403).json({ message: "Company not approved yet" });
      }
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    // 🔥 FINAL RESPONSE (IMPORTANT FIX)
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      id: user._id 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};