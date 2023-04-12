const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  org_id: { type: mongoose.Schema.Types.ObjectId, ref: "organisation" },
  total_share: { type: Number, default: 10 },
  remaining_share: { type: Number, default: 10 },
  share_prize: Number,
});

const Shares = mongoose.model("share", shareSchema);
module.exports = Shares;