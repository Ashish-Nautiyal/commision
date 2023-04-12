const User = require("../models/user/user.js"); 
const Organisation = require("../models/organisation/organisation.js");
const Commission = require("../models/commission/commission.js");
const UserPlan = require("../models/commission/userPlan.js");
const SoldShares = require("../models/share/soldShares");
const StartedBid = require("../models/biding/startedBid");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register API
module.exports.register = async (req, res) => {
  try {
    var body = req.body;
    let orgId;
    let orgCom;

    // user already exist or not
    let userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      res.status(201).json({ message: "User already exist" });
    } else {
      let password = body.password;
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.log("Something went wrong with password");
        }
        if (hash) {
          body.password = hash;
          let newUser = await User.create(body);
          let lastUser = await User.find({}).sort({ _id: -1 }).limit(1);
          let userPlan = await UserPlan.findOne({
            user_role: lastUser[0].role,
          });
          if (lastUser[0].role === 1) {
            await Organisation.create({
              userEmail: lastUser[0].email,
              orgName: req.body.org,
              orgCom: userPlan.organisation_commission,
            });
            await Organisation.findOne({ userEmail: lastUser[0].email }).then(
              (d) => {
                orgId = d._id;
              }
            );
          } else if (lastUser[0].role === 2) {
            let orgDetail = await Organisation.findOne({
              userEmail: lastUser[0].reference,
            });
            orgId = orgDetail._id;
            orgCom = orgDetail.orgCom;
            let newComm = orgCom + userPlan.organisation_commission;
            await Organisation.updateOne(
              { _id: orgId },
              { $set: { orgCom: newComm } }
            );
          } else {
            let userReference = await User.findOne({
              email: lastUser[0].reference,
            });

            let orgDetail = await Organisation.findOne({
              userEmail: userReference.reference,
            });
            orgId = orgDetail._id;
            orgCom = orgDetail.orgCom;
            let newComm = orgCom + userPlan.organisation_commission;
            await Organisation.updateOne(
              { _id: orgId },
              { $set: { orgCom: newComm } }
            );
          }

          await Commission.create({
            orgId: orgId,
            orgCom: userPlan.organisation_commission,
            userEmail: lastUser[0].reference,
            Refer: lastUser[0].email,
            userCom: userPlan.user_commission,
          });
        } else {
          console.log("else hash", hash);
        }
      });

      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// login API
module.exports.login = async (req, res) => {
  try {
    let body = req.body;

    if (body.email != "") {
      let user = await User.findOne({ email: body.email });
      if (!user) {
        return res
          .status(200)
          .json({ message: "Wrong user email", success: false });
      }
      // let success = await bcrypt.compare(body.password, user.password);
      let success = true;

      if (success) {
        // Creating Token
        let data = { userEmail: user.email, role: user.role };
        let token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });

        res.status(200).json({
          message: "User login successfully",
          success: true,
          data: token,
        });
      } else {
        res.status(200).json({ message: "Wrong password", success: false });
      }
    } else {
      res
        .status(200)
        .json({ message: "Email / Password Empty!!!", success: false });
    }
  } catch (err) {
    res.status(500).json({ message: "server error", success: false });
  }
};

// finding registered admin
module.exports.getAdmins = async (req, res) => {
  try {
    let admins = await User.find({ role: 1 }, { _id: 0, name: 1, email: 1 });
    if (admins.length > 0) {
      res
        .status(200)
        .json({ message: "Admins data", success: true, data: admins });
    } else {
      res
        .status(200)
        .json({ message: "Admins data not found", success: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// finding registered agent
module.exports.getAgents = async (req, res) => {
  try {
    let agents = await User.find({ role: 2 }, { _id: 0, name: 1, email: 1 });
    if (agents.length > 0) {
      res
        .status(200)
        .json({ message: "Agents data", success: true, data: agents });
    } else {
      res
        .status(200)
        .json({ message: "Agents data not found", success: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//find userData according to queryParams
module.exports.userData = async (req, res) => {
  let nameSearch = req.query.search || null;
  let email = req.query.email || {};
  let offset = parseInt(req.query.offset) || 0;
  let limit = parseInt(req.query.limit) || User.length;
  let startFrom = offset * limit;
  let totalRecords;
  let role;
  //checking role
  await User.find({ email: email })
    .then((d) => {
      role = parseInt(d[0].role);
    })
    .catch((e) => {
      role = e;
    });
  //checking search
  if (nameSearch != null) {
    await User.find({ name: { $regex: nameSearch, $options: "i" } })
      .skip(startFrom)
      .limit(limit)
      .then((d) => {
        res.send({ status: 200, data: d, count: d?.length });
      })
      .catch((e) => {
        res.send({ status: 404, msg: e, data: null });
      });
  } else {
    if (role == 0) {
      //checking count
      await User.find({})
        .count()
        .then((d) => {
          totalRecords = d - 1;
        });
      //all data
      await User.find({})
        .skip(startFrom + 1)
        .limit(limit)
        .then((d) => {
          var newdata = d.filter(function (data) {
            return data.email != email;
          });
          res.send({ status: 200, data: newdata, count: totalRecords });
        })
        .catch((e) => {
          res.send({ status: 404, msg: e, data: null });
        });
    } else {
      //checking count
      await User.find({ reference: email })
        .count()
        .then((d) => {
          totalRecords = d;
        })
        .catch((e) => {
          totalRecords = null;
        });

      //all refers
      await User.find({ reference: email })
        .skip(startFrom)
        .limit(limit)
        .then((d) => {
          res.send({ status: 200, data: d, count: totalRecords });
        })
        .catch((e) => {
          res.status(500).json({ message: e.message });
        });
    }
  }
};

//edit profile
module.exports.editUser = async (req, res) => {
  try {
    let updateUser = await User.updateOne(
      { email: req.body.email },
      { $set: req.body }
    );
    res.status(200).json({ message: "user profile updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

//Getting my shares
module.exports.getMyShares = async (req, res) => {
  try {
    let orgNames= [];

    //My Shares
    let myShares = await SoldShares.find({ user_email: req.body.email });
    // let myShares = await SoldShares.aggregate([
    //   {
    //           $lookup:
    //             {
    //               from: "organisations",
    //               localField: "org_id",
    //               foreignField: "_id",
    //               as: "organisation"
    //             }
    //        },
    // ]);


    //Getting organisation Names
    if (myShares.length > 0) {
      for (let i = 0; i < myShares.length; i++) {
        let res = await Organisation.findOne({ _id: myShares[i].org_id });
        orgNames.push(res.orgName);
      }
    }
    res.status(200).json({ message:"Shares record",success:true, shares: myShares, orgNames: orgNames });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

//user Profile
module.exports.profile = async (req, res) => {
  try {
    let organisation;
    let userCommission = 0;

    //My profile
    //  let lookup = await User.aggregate( [
    //     {
    //       $lookup:
    //         {
    //           from: "organisations",
    //           localField: "email",
    //           foreignField: "userEmail",
    //           as: "organisation"
    //         }
    //    },
    //    {
    //     $lookup:
    //       {
    //         from: "commissions",
    //         localField: "email",
    //         foreignField: "Refer",
    //         as: "commission"
    //       }
    //  },
    //  ] );
    //  console.log("lookup",lookup)

    let user = await User.findOne({ email: req.body.userEmail });
    if (!user) {
      res.status(404).json({ message: "user profile not found" });
    }

    // Org Commission
    if (user.role === 1) {
      organisation = await Organisation.findOne({ userEmail: user.email });
    } else if (user.role === 2) {
      organisation = await Organisation.findOne({ userEmail: user.reference });
    } else if (user.role === 3) {
      let userAgent = await User.findOne({ email: user.reference });
      organisation = await Organisation.find({
        userEmail: userAgent.reference,
      });
    } else {
      organisation = null;
    }

    //User Commission
    let commission = await Commission.find({ userEmail: req.body.userEmail });
    if (commission.length > 0) {
      for (let i = 0; i < commission.length; i++) {
        userCommission += parseInt(commission[i].userCom);
      }
    }

    //Biding Status
    let bidStatus = await StartedBid.findOne({
      $and: [{ user_email: req.body.userEmail }, { bid_status: true }],
    });
    if (!bidStatus) {
      bidStatus = null;
    }

    // Sending Data
    res.status(200).json({
      user: user,
      organisation: organisation,
      commission: userCommission,
      bidStatus: bidStatus,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
