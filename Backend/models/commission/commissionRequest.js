const mongoose = require("mongoose");

const orgComSchema = new mongoose.Schema({
  org_id:{ type: mongoose.Schema.Types.ObjectId, ref: "organisation" },
  user_email: { type: String, ref: "user" },
  Role:String,
  requestApproved:Boolean
});

const CommissionRequest = mongoose.model("commissionRequest",orgComSchema);
module.exports = CommissionRequest; 
