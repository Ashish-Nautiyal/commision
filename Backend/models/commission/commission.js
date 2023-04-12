const mongoose = require("mongoose");

const comSchema = new mongoose.Schema({ 
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "organisation" },
  orgCom: String,
  userEmail: { type: String, ref: "user" },
  Refer: { type: String, ref: "user" },
  userCom: String,
 
});

const Commission = mongoose.model("commission", comSchema);
module.exports = Commission;