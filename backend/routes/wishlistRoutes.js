const { verifyToken } = require('../config/jwt');
const{getwishlist,addTowishlist,removeFromwishList}=require('../controllers/wishlistController')
const express=require('express');
const router=express.Router();
router.get('/',verifyToken,getwishlist);
router.delete('/:productId',verifyToken,removeFromwishList);
router.post('/:productId',verifyToken,addTowishlist);
module.exports=router;