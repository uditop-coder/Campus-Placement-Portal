const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    required: true 
  },

  jobTitle: { 
    type: String, 
    required: true 
  },

  description: String,

  eligibility: String,

  deadline: Date,

  status: { 
    type: String, 
    default: "open" 
  },

  isOpen: { 
    type: Boolean, 
    default: true 
  }

}, { timestamps: true });

module.exports = mongoose.model("Drive", driveSchema);