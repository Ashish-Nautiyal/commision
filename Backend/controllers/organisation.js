const User = require("../models/user/user.js");
const Organisation = require("../models/organisation/organisation.js");
const Commission = require("../models/commission/commission.js");
const UserPlan = require("../models/commission/userPlan.js");
const CommissionRequest = require("../models/commission/commissionRequest");

//Organisation
module.exports.myOrganisation = async (req, res) => {
  try {
    var organisation;
    let user = await User.findOne({ email: req.body.email });
    if (user.role == 1) {
      organisation = await Organisation.findOne({ userEmail: user.email });
    } else if (user.role == 2) {
      organisation = await Organisation.findOne({ userEmail: user.reference });
    } else if (user.role == 3) {
      let userAgent = await User.findOne({ email: user.reference });
      organisation = await Organisation.findOne({
        userEmail: userAgent.reference,
      });
    } else {
      organisation = null;
    }
    console.log("organisation",organisation);

    res.status(200).json({
      message: "Organisation data",
      success: true,
      data: organisation,
    });
  } catch (err) { 
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

//Commission Request save
module.exports.commissionRequest = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.user_email });
    if (user.role === 2 || user.role === 3) {
      let checkRequest = await CommissionRequest.findOne({
        user_email: req.body.user_email,
      });
      if (!checkRequest) {
        await CommissionRequest.create(req.body);
        res.status(200).json({ message: "Request accepted", success: true });
      } else {
        res.status(200).json({ messsage: "Already requested", success: false });
      }
    } else {
      res
        .status(200)
        .json({ message: "Admin/superAdmin can't request", success: false });
    }
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

//checking commission Request
module.exports.checkCommissionRequest = async (req, res) => {
  try{
    var organisation;
    var userExist;
    var pending;
    var renew;
  
    let user = await User.findOne({ email: req.body.email });
  
    //finding organisation id
    if (user.role === 2) {
      organisation = await Organisation.findOne({
        userEmail: user.reference,
      });
    } else if (user.role === 3) {
      let userAgent = await User.findOne({ email: user.reference });
      organisation = await Organisation.findOne({
        userEmail: userAgent.reference,
      });
    } else {
      return res.status(200).json({ message: "Admin / Superadmin  can't request for commission" });
    }
  
    ////////////////////////////////////////////////////////////////////
  
    let allRequests = await CommissionRequest.find({
      $or: [
        {
          $and: [
            { Role: "2" },
            { requestApproved: false },
            { org_id: organisation._id },
          ],
        },
        {
          $and: [
            { Role: "3" },
            { requestApproved: false },
            { org_id: organisation._id },
          ],
        },
      ],
    });
  
    //filter requests
    let agentsCount = allRequests.filter(function (data) {
      return data.Role == "2";
    });
  
    let usersCount = allRequests.filter(function (data) {
      return data.Role == "3";
    });
  
    if (usersCount.length == 3 || agentsCount.length == 3) {
      userExist = false;
      renew = false;
      pending = true;
    } else {
      let checkRequest = await CommissionRequest.findOne({ user_email: req.body.email });
        if (checkRequest.requestApproved== true) {
          userExist = false;
          renew = true;
          pending = false;
        } else if (checkRequest.requestApproved == false) {
          userExist = false;
          renew = false;
          pending = true;
        } else {
          userExist = true;
          renew = false;
          pending = false;
        }    
    }
    res.status(200).json({
      message:"ok",
      success:true,  
      request: userExist,
      renew: renew,
      pending: pending,
    });
  }catch(err){
    res.status(500).json({message:"server error"});
  } 
};

//checking request count
module.exports.requestCount = async (req, res) => {
  var agentCount;
  var userCount;
  var requestEmail = [];
  var Admin;
  var References = [];
  //count for agent
  await CommissionRequest.distinct("org_id").then(async (d) => {
    if (d.length != 0) {
      for (let i = 0; i < d.length; i++) {
        await CommissionRequest.find({
          $or: [
            {
              $and: [
                { Role: "2" },
                { requestApproved: false },
                { org_id: d[i] },
              ],
            },
            {
              $and: [
                { Role: "3" },
                { requestApproved: false },
                { org_id: d[i] },
              ],
            },
          ],
        }).then(async (d) => {
          agentCount = d.filter(function (data) {
            return data.Role == "2";
          });
          userCount = d.filter(function (data) {
            return data.Role == "3";
          });
        });
        //checking agent request count
        if (agentCount.length == 3) {
          await Organisation.find(
            { _id: agentCount[0].org_id },
            { _id: 0, userEmail: 1 }
          ).then((d) => {
            Admin = d[0].userEmail;
          });
          for (let i = 0; i < agentCount.length; i++) {
            if (requestEmail.includes(agentCount[i].user_email)) {
              console.log("agentCount",agentCount[i].user_email);
            } else {
              requestEmail.push(agentCount[i].user_email);
            }
          }
          break;
        }
        //checking user request count
        if (userCount.length == 3) {
          await Organisation.find(
            { _id: userCount[0].org_id },
            { _id: 0, userEmail: 1 }
          ).then((d) => {
            Admin = d[0].userEmail;
          });
          for (let i = 0; i < userCount.length; i++) {
            await User.find({ email: userCount[i].user_email }).then((d) => {
              let reference = d[0].reference;
              if (References.includes(reference)) {
                console.log("reference",reference);
              } else {
                References.push(reference);
              }
            });
            requestEmail.push(userCount[i].user_email);
          }
          break;
        }
      }
    } else {
      userCount = [];
      agentCount = [];
    }
  });
  if (userCount.length == 3 || agentCount.length == 3) {
    res.send({
      status: 200,
      userdata: requestEmail,
      admindata: Admin,
      References: References,
      request: true,
    });
  } else {
    res.send({ status: 200, request: false });
  }
};

//organisation release
module.exports.releaseOrg = async (req, res) => {
  var userEmails = req.body.userdata;
  var Admin = req.body.admin;
  var superAdmin;
  var References = req.body.References;
  var amount;
  var orgId;

  await User.find({ role: "0" }, { email: 1, _id: 0 }).then((d) => {
    superAdmin = d[0].email;
  });
  await Organisation.find({ userEmail: Admin }).then((d) => {
    orgId = d[0]._id;
    amount = d[0].orgCom;
  });

  if (References.length == 0) {
    let superAdminCom = (amount * 5) / 100;
    let adminCom = (amount * 5) / 100;
    let agentsCom = (amount * 40) / 100;
    let perAgent = agentsCom / userEmails.length;

    await Commission.create({
      orgId: orgId,
      userEmail: superAdmin,
      userCom: superAdminCom,
    });

    await Commission.create({
      orgId: orgId,
      userEmail: Admin,
      userCom: adminCom,
    });

    for (var i = 0; i < userEmails.length; i++) {
      await Commission.create({
        orgId: orgId,
        userEmail: userEmails[i],
        userCom: perAgent,
      });
      await CommissionRequest.updateOne(
        { user_email: userEmails[i] },
        { $set: { requestApproved: true } }
      );
    }

    let remainingAmount = amount - (superAdminCom + adminCom + agentsCom);
    await Organisation.updateOne(
      { _id: orgId },
      { $set: { orgCom: remainingAmount } }
    );
    res.send({ status: 200, request: false });
  } else {
    let superAdminCom = (amount * 5) / 100;
    let agentsCom = (amount * 10) / 100;
    let usersCom = (amount * 40) / 100;
    let perAgent = agentsCom / References.length;
    let perUser = usersCom / userEmails.length;

    await Commission.create({
      orgId: orgId,
      userEmail: superAdmin,
      userCom: superAdminCom,
    });

    for (let i = 0; i < References.length; i++) {
      await Commission.create({
        orgId: orgId,
        userEmail: References[i],
        userCom: perAgent,
      });
    }

    for (let i = 0; i < userEmails.length; i++) {
      await Commission.create({
        orgId: orgId,
        userEmail: userEmails[i],
        userCom: perUser,
      });

      await CommissionRequest.updateOne(
        { user_email: userEmails[i] },
        { $set: { requestApproved: true } }
      );
    }

    let remainingAmount = amount - (superAdminCom + agentsCom + usersCom);
    await Organisation.updateOne(
      { _id: orgId },
      { $set: { orgCom: remainingAmount } }
    );
    res.send({ status: 200, request: false });
  }
};

//reopen account
module.exports.reopen = async (req, res) => {
  email = req.body.email;
  orgId = req.body.orgId;
  var Role;
  var orgCom;
  await User.find({ email: email }).then((d) => {
    Role = d[0].role;
  });
  await CommissionRequest.deleteOne({ user_email: email });
  await Organisation.find({ _id: orgId }).then((d) => {
    orgCom = parseInt(d[0].orgCom);
  });
  await UserPlan.find({ Role: Role }).then(async (d) => {
    newOrgCom = orgCom + d[0].orgCom;
    await Organisation.updateOne(
      { _id: orgId },
      { $set: { orgCom: newOrgCom } }
    );
  });
  res.send({
    status: 200,
    request: true,
    renew: false,
    pending: false,
  });
};
