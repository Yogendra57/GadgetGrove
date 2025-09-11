const express = require("express");
const router = express.Router();
const { createOrder, verifyPaymentAndSaveOrder,sendPaymentFailedEmail } = require("../controllers/paymentController");
const {verifyToken}=require('../config/jwt')

router.post("/create-order",verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPaymentAndSaveOrder);

router.post('/payment-failed', verifyToken, sendPaymentFailedEmail);

module.exports = router;
