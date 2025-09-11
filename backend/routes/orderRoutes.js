// const express=require('express');
// const router=express.Router();
// const{createOrder,getOrderById,myOrders,payOrder,deliverOrder}=require('../controllers/orderController')
// const{verifyToken}=require('../config/jwt')
// const{isAdmin}=require('../middleware/authMiddleware')
// // Create Order: POST /api/orders
// router.post('/',verifyToken,createOrder);
// // GET /api/orders/myorders
// router.get('/my-orders',verifyToken,myOrders);
// // Get Order By ID: GET /api/orders/:id
// router.get('/:id',verifyToken,getOrderById);
// // Update Order to Paid: PUT /api/orders/:id/pay
// router.put('/:id/pay',verifyToken,payOrder);
// // Update Order to Delivered: PUT /api/orders/:id/deliver (Admin only)

// router.put('/:id/deliver',verifyToken,isAdmin,deliverOrder);
// module.exports=router;

const express=require('express');
const { verifyToken } = require('../config/jwt');
const {getOrderById,getMyOrders,getAllOrders,updateOrderToDelivered,downloadInvoice} = require('../controllers/orderController');
const {isAdmin} = require('../middleware/authMiddleware');
const router=express.Router();
router.get('/myorders',verifyToken,getMyOrders);
router.get('/:id',verifyToken,getOrderById);
router.get('/admin/all', verifyToken, isAdmin, getAllOrders);
router.put('/:id/deliver', verifyToken, isAdmin, updateOrderToDelivered);
router.get('/:id/invoice', verifyToken, downloadInvoice);
module.exports=router;