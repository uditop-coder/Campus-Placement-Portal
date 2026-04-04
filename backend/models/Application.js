const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drive"
  },
  status: {
    type: String,
    default: "Applied"
  }
});

module.exports = mongoose.model("Application", applicationSchema);