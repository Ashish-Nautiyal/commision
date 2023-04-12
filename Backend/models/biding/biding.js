const mongoose = require("mongoose");

const comSchema = new mongoose.Schema({
  org_id: { type: mongoose.Schema.Types.ObjectId, ref: "organisation" },
  user_email: { type: String, ref: "user" },
  share_percentage: Number,
  share_price: Number,
});

const Bidings = mongoose.model("biding", comSchema);
module.exports = Bidings;
