const express=require('express');
const router=express.Router();
const {verifyToken}=require('../config/jwt')
const{loginUser,verifyOtp,registerUser,logoutUser,forgotPassword,resetPassword,getUserDetails}=require('../controllers/userController');
router.post('/register',registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.get('/',verifyToken,getUserDetails);
module.exports=router;