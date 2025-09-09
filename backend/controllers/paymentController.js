const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order'); // Import your Order model
const { create } = require('../models/User');

// Initialize Razorpay instance from environment variables
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Step 1: Create a Razorpay Order ID.
 * The frontend calls this function when the user clicks "Proceed to Payment".
 * It takes the total amount and returns an order object from Razorpay.
 */
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in rupees from client

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount provided." });
        }

        const options = {
            amount:Math.round( Number(amount) * 100), // Amount in paise (smallest currency unit)
            currency: 'INR',
            receipt: `receipt_order_${crypto.randomBytes(10).toString('hex')}`, // Unique receipt ID
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Razorpay order creation failed.' });
        }

        res.status(200).json({ order });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: 'Server error while creating order.' });
    }
};

/**
 * Step 2: Verify Payment Signature and Save Order to Database.
 * The frontend calls this function after the user successfully completes payment on Razorpay modal.
 */
const verifyPaymentAndSaveOrder = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails // Contains cart items, shipping address, and final prices calculated on frontend
        } = req.body;

        // 1. Verify Razorpay Signature for security
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature. Payment verification failed.' });
        }

        // 2. Map frontend order details to match your Mongoose Schema structure
        const mappedOrderItems = orderDetails.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            image: item.image[0], // Assuming image is an array and taking the first one
            price: item.price,
            product: item.product // The MongoDB ObjectId of the product
        }));

        // 3. Create new order object based on your schema
        const newOrder = new Order({
            user: req.user._id, // Assumes auth middleware provides req.user
            orderItems: mappedOrderItems,
            shippingAddress: orderDetails.shippingAddress, // Ensure frontend sends object matching schema
            paymentMethod: 'Razorpay',
            paymentResult: {
                id: razorpay_payment_id,
                status: 'success',
                update_time: new Date().toISOString(),
                email_address: req.user.email, // Assumes auth middleware provides req.user
            },
            itemsPrice: orderDetails.itemsPrice,
            taxPrice: orderDetails.taxPrice,
            shippingPrice: orderDetails.shippingPrice,
            totalPrice: orderDetails.totalPrice,
            isPaid: true,
            paidAt: Date.now(),
        });

        // 4. Save the order to database
        const savedOrder = await newOrder.save();

        res.status(201).json({ 
            message: 'Payment verified successfully and order created!', 
            order: savedOrder 
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: 'Server error while verifying payment.' });
    }
};
module.exports = {createOrder,verifyPaymentAndSaveOrder};