const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken } = require("../config/jwt");
const {getProfile,updateProfile} = require("../controllers/profileController");

router.get('/',verifyToken,getProfile);
router.put('/', 
    verifyToken, 
    upload.fields([
        { name: 'profileImage', maxCount: 1 }, 
        { name: 'coverImage', maxCount: 1 }
    ]), 
    updateProfile
);
module.exports = router;