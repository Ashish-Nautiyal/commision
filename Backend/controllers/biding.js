const Organisation = require("../models/organisation/organisation.js");
const Biding = require("../models/biding/biding");
const StartedBid = require("../models/biding/startedBid");
const SoldShares = require("../models/share/soldShares");

//Display biding detail
module.exports.displayBidingsList = async (req, res) => {
  try {
    let orgName = [];
    let bidTime = [];
    let highestBid = [];

    //Getting biding list
    let bidsList = await Biding.find({});
    if(bidsList.length<1){
      return res.status(200).json({message:"bid not available"});
    }
    //Checking each biding detail
    for (let i = 0; i < bidsList.length; i++) {
      //Getting Started Bids Time
      let startBidsTime = await StartedBid.findOne({
        $and: [
          { org_id: bidsList[i].org_id },
          { share_holder: bidsList[i].user_email },
        ],
      });

      //Checking started bids time have or not and also managing array according to bidlist
      if (startBidsTime != null) {
        bidTime.push(startBidsTime);
      } else {
        bidTime.push(null);
      }

      // Getting highest bid info
      let bidPrices = await StartedBid
        .find(
          {
            $and: [
              { org_id: bidsList[i].org_id },
              { share_holder: bidsList[i].user_email },
            ],
          },
          { bid_price: 1, user_email: 1, _id: 0 }
        )
        .sort({ bid_price: -1 })
        .limit(1);

      //Checking highest bid have or not and also managing array according to bidlist
      if (bidPrices.length != 0) {
        highestBid.push({
          bidprice: bidPrices[0].bid_price,
          name: bidPrices[0].user_email,
        });
      } else {
        highestBid.push(0);
      }

      //Getting Organisation Names
      let organisation = await Organisation.findOne({ _id: bidsList[i].org_id });
      orgName.push(organisation.orgName);
    }
    let result = {
      bidsList: bidsList,
      bidTime: bidTime,
      orgNames: orgName,
      highestBid: highestBid,
    };
    if (bidsList.length != 0) {
      res.status(200).send(result);
    } else {
      res.status(404).send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message:"server error"});
  }
};

//Adding Shares in biding list
module.exports.addBidingList = async (req, res) => {
  try {
    let body = req.body;
    //Getting user's hold shares of requested organisation
    let haveShares = await SoldShares.findOne({
      $and: [{ org_id: req.body.org_id }, { user_email: req.body.user_email }],
    });

    // checking and updating shares of user
    if (haveShares) {
      let avalShares =
        haveShares.share_percentage - parseInt(req.body.share_percentage);

      if (avalShares >= 0) {
        let updateShare = await SoldShares.updateOne(
          { _id: haveShares._id },
          { $set: { share_percentage: avalShares } }
        );

        //Getting user's biding shares of requested organisation
        let bids = await Biding.findOne({
          $and: [{ org_id: body.org_id }, { user_email: body.user_email }],
        });

        //checking user's have biding shares or not
        if (bids) {
          let new_share_percentage =
            bids.share_percentage + parseInt(body.share_percentage);

          let update = await Biding
            .updateOne(
              {
                $and: [
                  { org_id: body.org_id },
                  { user_email: body.user_email },
                ],
              },
              { $set: { share_percentage: new_share_percentage } }
            )
            .then((d) => {
              res.send({ status: 200, data: d });
            })
            .catch((err) => {
              res.send({ status: 200, msg: err });
            });
        } else {
          let orga = await Organisation.findOne({ _id: req.body.org_id });
          body.share_price = (orga.orgCom * 1) / 100;
          let create = await Biding
            .create(req.body)
            .then((d) => {
              res.send({ status: 200, data: d });
            })
            .catch((err) => {
              res.send({ status: 200, msg: err });
            });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 200, msg: err });
  }
};

//Save Bid
module.exports.addBid = async (req, res) => {
  try {
    let body = req.body;
    let currentDate = new Date();
    let countDownDate = currentDate.setMinutes(currentDate.getMinutes() + 1);
    let newDate = new Date(countDownDate).toString();
    // let data = await StartedBid.find({});
    // let bidData = await Biding.find();
    // for (let i = 0; i  < bidData.length; i++) {
    let data = await StartedBid.findOne({
      $and: [{ org_id: body.org_id }, { share_holder: body.share_holder }],
    });
    if (data != null) {
      body.date_time = data.date_time;
      let alreadyExist = await StartedBid.findOne({
        $and: [
          { org_id: body.org_id },
          { share_holder: body.share_holder },
          { user_email: body.user_email },
        ],
      });
      if (alreadyExist) {
        await StartedBid
          .updateOne(
            {
              _id: alreadyExist._id,
            },
            { $set: { bid_price: body.bid_price } }
          )
          .then((r) => {
            res.send({ status: 200, data: r });
          })
          .catch((err) => {
            console.log(err);
            res.send({ status: 400, msg: err });
          });
      } else {
        await StartedBid
          .create(body)
          .then((r) => {
            res.send({ status: 200, data: r });
          })
          .catch((err) => {
            console.log(err);
            res.send({ status: 400, msg: err });
          });
      }
    } else {
      body.date_time = newDate;
      await StartedBid
        .create(body)
        .then((r) => {
          res.send({ status: 200, data: r });
        })
        .catch((err) => {
          console.log(err);
          res.send({ status: 400, msg: err });
        });
    }
    // }
  } catch (err) {
    console.log(err);
    res.send({ status: 200, msg: err });
  }
};


//Bid Time Expired
module.exports.bidExpired = async (req, res) => {
  try {
    //Getting all biding
    let allBids = await StartedBid.find({ date_time: req.body.date });

    //Highest Bid
    let highestBid = await StartedBid
      .find({ date_time: req.body.date })
      .sort({ bid_price: -1 })
      .limit(1);


    //Checking have bid or not
    if (highestBid.length != 0) {
      let currentDate = new Date();
      let countDownDate = currentDate.setMinutes(currentDate.getMinutes() + 1);
      let newDate = new Date(countDownDate).toString();

      let winner = await StartedBid.updateOne(
        { _id: highestBid[0]._id },
        { $set: { bid_status: true, date_time: newDate } }
      );

      //Removing all losing Bids
      for (let i = 0; i < allBids.length; i++) {
        await StartedBid.deleteOne({
          $and: [{ date_time: req.body.date }, { bid_status: false }],
        });
      }
      res.send({ sataus: 200, msg: "Success" });
    } else {
      res.send({ sataus: 404, msg: "Fail" });
    }
  } catch (err) {
    console.log(err);
  }
};

//win bid Time Expired
module.exports.winBidExpired=async(req,res)=>{  
  try{
    let id = req.query.id;
   await StartedBid.deleteOne({_id:id});
   res.status(200).send({message:"data deleted",success:true});
     }catch(err){      
    console.log(err);
   res.status(404).send({message:"catch error",success:false});
  }
  
}

//purchase win bid
module.exports.purchaseWinBid=async(req,res)=>{
  try{
    let shareObject={
      org_id:req.body.org_id,
      user_email:req.body.user_email,
      share_percentage:req.body.share_percentage
    }
    await SoldShares.create(shareObject);
    await StartedBid.deleteOne({_id:req.body._id});
    await Biding.deleteOne({$and:[{org_id:req.body.org_id},{user_email:req.body.share_holder}]});
   
    res.status(200).send({message:"success",success:true});
  }catch(err){
    console.log(err);
  }
}