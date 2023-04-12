const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  org_id: { type: mongoose.Schema.Types.ObjectId, ref: "organisation" },
  share_holder: { type: String, ref: "user" },
  user_email: { type: String, ref: "user" },
  share_percentage: Number,
  share_price: Number,
  bid_price: Number,
  date_time: Date,
  bid_status:{type:Boolean,default:false}
});

const StartedBid = mongoose.model("startedBid", bidSchema); 
module.exports = StartedBid;
