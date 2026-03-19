const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  companyName: String,
  hrContact: String,
  website: String,
  approved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Company", companySchema);