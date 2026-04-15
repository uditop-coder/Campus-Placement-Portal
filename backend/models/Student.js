const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  name: { 
    type: String, 
    required: true 
  },

  branch: String,
  section: String,

  rollNo: { 
    type: String, 
    unique: true 
  },

  contact: String,
  address: String,

  cgpa: Number,

  resume: String,

  portfolio: String,
  projects: String,
  experience: String,
  hobbies: String,

  blacklisted: { 
    type: Boolean, 
    default: false 
  },

  isActive: { 
    type: Boolean, 
    default: true 
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);