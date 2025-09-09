const express=require('express');
const router=express.Router()
const {getCart,addTocart,Updatequantity,deleteProduct,clearCart}=require('../controllers/cartcontroller')
const {verifyToken}=require('../config/jwt')
router.get('/',verifyToken,getCart);
router.post('/',verifyToken,addTocart);
router.delete('/clear',verifyToken,clearCart);
router.patch('/items/:productId',verifyToken,Updatequantity);
router.delete('/items/:productId',verifyToken,deleteProduct);

module.exports=router