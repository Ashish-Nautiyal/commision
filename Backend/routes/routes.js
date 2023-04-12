const userController = require("../controllers/user");
const orgController = require("../controllers/organisation");
const shareController = require("../controllers/share");
const bidingController = require("../controllers/biding");


const router = require("express").Router();
const auth=require("../auth/auth.js");

//user controller
router.post("/signUp", userController.register);
router.post("/login", userController.login);
router.get("/getAdmins", userController.getAdmins);
router.get("/getAgents", userController.getAgents);
router.post("/getMyShares",userController.getMyShares);
router.post('/profile',auth,userController.profile);
router.put("/editProfile",auth,userController.editUser);
router.get('/getUsers',auth,userController.userData);



//org controller
router.post('/organisation/myOrg',auth,orgController.myOrganisation);
router.post('/commission/commissionRequest',auth,orgController.commissionRequest);
router.post('/commission/checkCommissionRequest',auth,orgController.checkCommissionRequest);
router.get('/requestCount',auth,orgController.requestCount);
router.post('/releaseOrg',auth,orgController.releaseOrg);
router.post('/reopen',auth,orgController.reopen);


//share controller
router.post('/shareEntry',auth,shareController.shareInsert);
router.post('/shareCheck',auth,shareController.share);
router.get('/displayShare',auth,shareController.displayShares);
router.post('/buyedShares',auth,shareController.buyedShares); 
router.get('/shareReleaseReq',auth,shareController.shareReleaseReq);
router.post('/shareRelease',auth,shareController.shareRelease);


//biding controller
router.post('/addBid',auth,bidingController.addBidingList);
router.get('/displayBiding',auth,bidingController.displayBidingsList);
router.put('/saveBid',auth,bidingController.addBid);
router.post('/bidExpired',auth,bidingController.bidExpired);
router.delete('/winBidExpired',auth,bidingController.winBidExpired);
router.post('/purchaseWinBid',auth,bidingController.purchaseWinBid);

module.exports = router;
