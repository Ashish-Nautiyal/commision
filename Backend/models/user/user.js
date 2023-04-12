const mongoose = require("mongoose");
 
const registerSchema = new  mongoose.Schema({
  name: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  password: { type: String },
  role:{type:Number},
  reference:{type:String}
});

const registerObj = mongoose.model("user", registerSchema); 
module.exports = registerObj;
