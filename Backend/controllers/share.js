const Organisation  = require("../models/organisation/organisation.js");
const Shares = require("../models/share/share");
const SoldShares = require("../models/share/soldShares");


//share Available or not
module.exports.share = async (req, res) => {
    let orgId = req.body.orgId;
    try {
      await Shares.find({ org_id: orgId }).then((d) => {
        if (d.length != 0) {
          res.send({ status: 200, shareAval: false });
        } else {
          res.send({ status: 200, shareAval: true });
        }
      });    
    } catch (err) {
      res.status(404).send(err);
    }
  };
  
  //share Entry
  module.exports.shareInsert = async (req, res) => {
    let orgId = req.body.orgId;
    let sharePrize;
    try {
      await Organisation .find({ _id: orgId }).then((d) => {
        sharePrize = (d[0].orgCom * 1) / 100;
      });
  
      await Shares
        .create({ org_id: orgId, share_prize: sharePrize })
        .then((d) => {
          if (d.length != 0) {
            res.send({ status: 200, shareAval: false });
          } else {
            res.send({ status: 200, shareAval: true });
          }
        });
    } catch (err) {
      res.status(404).send(err);
    }
  };
  
  //display Shares
  module.exports.displayShares = async (req, res) => {
    let orgNames = [];
    let data;
    try {
      await Shares.find({}).then(async (d) => {
        data = d;
        for (let i = 0; i < data.length; i++) {
          var a = await Organisation .find({ _id: data[i].org_id });
          orgNames.push(a[0].orgName);
        }
      });
      if (data.length != 0) {
        res.send({ status: 200, data: data, orgNames: orgNames });
      } else {
        res.send({ status: 200, data: data, orgNames: [] });
      }
    } catch (err) {
      res.send({ status: 404, data: err });
    }
  };
  
  //buy Shares entry
  module.exports.buyedShares = async (req, res) => {
    try {
      var remainingShares;
  
      await Shares.find({ org_id: req.body.org_id }).then(async (d) => {
        remainingShares =
          d[0].remaining_share - parseInt(req.body.share_percentage);
        if (remainingShares > 0) {
          await SoldShares
            .find({
              $and: [
                { org_id: req.body.org_id },
                { user_email: req.body.user_email },
              ],
            })
            .then(async (d) => {
              if (d.length != 0) {
                let newSharePer =
                  parseInt(req.body.share_percentage) + d[0].share_percentage;
                await SoldShares.updateOne(
                  { _id: d[0]._id },
                  { $set: { share_percentage: newSharePer } }
                );
              } else {
                await SoldShares.create(req.body);
              }
            });
  
          await Shares.updateOne(
            { org_id: req.body.org_id },
            { $set: { remaining_share: remainingShares } }
          );
        } else if (remainingShares == 0) {
          // await SoldShares.create(req.body);
          await SoldShares
            .find({
              $and: [
                { org_id: req.body.org_id },
                { user_email: req.body.user_email },
              ],
            })
            .then(async (d) => {
              if (d.length != 0) {
                let newSharePer =
                  parseInt(req.body.share_percentage) + d[0].share_percentage;
                await SoldShares.updateOne(
                  { _id: d[0]._id },
                  { $set: { share_percentage: newSharePer } }
                );
              } else {
                await SoldShares.create(req.body);
              }
            });
          await Shares.deleteOne({ org_id: req.body.org_id });
        }
      });
      res.send({ status: 200 });
    } catch (err) {
      console.log(err);
      res.send({ status: 404, msg: err });
    }
  };
  
  //share release req checking
  module.exports.shareReleaseReq = async (req, res) => {
    let data = [];
    await SoldShares.find({ share_request: true }).then((d) => {
      if (d.length != 0) {
        for (var i = 0; i < d.length; i++) {
          data1 = {
            org_id: d[i].org_id,
            user_email: d[i].user_email,
          };
          data.push(data1);
        }
  
        res.send({ status: 200, release: true, data: data });
      } else {
        res.send({ status: 200, release: false, data: null });
      }
    });
  };
  
  //share release
  module.exports.shareRelease = async (req, res) => {
    let data = req.body.data;
    try {
      for (var i = 0; i < data.length; i++) {
        await SoldShares.deleteOne({
          $and: [{ org_id: data[i].org_id }, { user_email: data[i].user_email }],
        });
      }
      res.send({ status: 200 });
    } catch (err) {
      console.log(err);
      res.send({ status: 404 });
    }
  };
  