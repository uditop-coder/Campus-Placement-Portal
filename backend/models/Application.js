const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },

  drive: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Drive", 
    required: true 
  },

  appliedAt: { 
    type: Date, 
    default: Date.now 
  },

  status: { 
    type: String, 
    enum: ["applied", "shortlisted", "selected", "rejected"],
    default: "applied"
  },

  resume: String

}, { timestamps: true });

applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);