const express = require("express");
const router = express.Router();
const { createOrder, verifyPaymentAndSaveOrder } = require("../controllers/paymentController");
const {verifyToken}=require('../config/jwt')
// ✅ Each handler must be a function
router.post("/create-order",verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPaymentAndSaveOrder);

module.exports = router;
