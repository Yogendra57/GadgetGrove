const jwt=require('jsonwebtoken')
const User=require('../models/User')
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'});
}



const verifyToken=async (req,res,next)=>{
    let token =req.cookies.token;
    if (!token && req.headers.authorization) {
        // Strip the "Bearer " prefix from the Authorization header
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({message:'No Authorized no token'})
    }
    try{
       
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decode.id).select('-password');
        next();
    

    }catch(error){
        console.error(error);
        return res.status(401).json({message:'Eror Verifying token',error:error});
    }
    
}

module.exports={generateToken,verifyToken};