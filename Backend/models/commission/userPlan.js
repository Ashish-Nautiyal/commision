const mongoose= require("mongoose");

const planSchema=mongoose.Schema({
    user_role:Number,
    plan_cost:Number,
    user_commission:Number, 
    organisation_commission:Number 
});

const UserPlan=mongoose.model('userPlan',planSchema);
module.exports=UserPlan;