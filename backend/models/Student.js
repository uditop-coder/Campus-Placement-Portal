const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  email: String,
  branch: String,
  resume: String
});

module.exports = mongoose.model("Student", studentSchema);