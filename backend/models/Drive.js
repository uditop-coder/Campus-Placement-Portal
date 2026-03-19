const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  jobTitle: String,
  description: String,
  eligibility: {
    cgpa: Number,
    branch: String
  },
  deadline: Date,
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Drive", driveSchema);