const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  companyName: { 
    type: String, 
    required: true 
  },

  description: String,

  hrContact: String,

  managerName: String,

  website: String,

  approved: { 
    type: Boolean, 
    default: false   
  },

  blacklisted: { 
    type: Boolean, 
    default: false 
  },

  isActive: { 
    type: Boolean, 
    default: true 
  }

}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);