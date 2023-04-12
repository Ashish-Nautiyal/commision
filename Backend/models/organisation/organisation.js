const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  userEmail:{ type: String, ref: "user" }, 
  orgName:String,
  orgCom:Number
});

const Organisation = mongoose.model("organisation",orgSchema);
module.exports = Organisation;
