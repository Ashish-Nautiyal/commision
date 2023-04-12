const jwt=require('jsonwebtoken');

const auth=async(req,res,next)=>{
    try{        
        const token=req.headers["authorization"];
        const verifyUser=jwt.verify(token,process.env.JWT_SECRET_KEY);
        next();
    }catch(error){
        res.status(401).send(error);
    }
} 

module.exports=auth;