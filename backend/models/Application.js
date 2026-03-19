const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drive"
  },
  status: {
    type: String,
    default: "Applied"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Application", applicationSchema);