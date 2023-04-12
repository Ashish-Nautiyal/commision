const mongoose = require("mongoose");

const releaseSchema=new mongoose.Schema({
    org_id:{type:mongoose.Schema.Types.ObjectId,ref:"organisation"},
    user_email:{type:mongoose.Schema.Types.String,ref:"user"},
    share_percentage:Number,
    share_request:{type:Boolean,default:false}   
})

const SoldShares= new mongoose.model("soldShare",releaseSchema);

module.exports=SoldShares;
