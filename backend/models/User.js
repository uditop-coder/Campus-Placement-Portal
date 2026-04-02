const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: { type: String, unique: true },

  password: String,

  role: {
    type: String,
    enum: ["admin", "company", "student"]
  },

  isApproved: {
    type: Boolean,
    default: function () {
      return this.role === "student"; // students auto approved
    }
  },

  // 🎓 STUDENT FIELDS
  branch: String,
  section: String,
  rollNo: String,

  // 🏢 COMPANY FIELDS
  description: String,
  managerName: String

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);