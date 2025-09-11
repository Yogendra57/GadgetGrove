const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order"); // Import your Order model
const { create } = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
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
      amount: Math.round(Number(amount) * 100), // Amount in paise (smallest currency unit)
      currency: "INR",
      receipt: `receipt_order_${crypto.randomBytes(10).toString("hex")}`, // Unique receipt ID
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res
        .status(500)
        .json({ message: "Razorpay order creation failed." });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server error while creating order." });
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
      orderDetails, // Contains cart items, shipping address, and final prices calculated on frontend
    } = req.body;

    // 1. Verify Razorpay Signature for security
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    // 2. Map frontend order details to match your Mongoose Schema structure
    const mappedOrderItems = orderDetails.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image[0],
      price: item.price,
      product: item.product, // The MongoDB ObjectId of the product
    }));

    // 3. Create new order object based on your schema
    const newOrder = new Order({
      user: req.user._id,
      orderItems: mappedOrderItems,
      shippingAddress: orderDetails.shippingAddress,
      paymentMethod: "Razorpay",
      paymentResult: {
        id: razorpay_payment_id,
        status: "success",
        update_time: new Date().toISOString(),
        email_address: req.user.email,
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
    let emailHtml = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; }
        .wrapper { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #28a745; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; color: #333; }
        .content h2 { color: #333; }
        .order-summary, .price-summary { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .order-summary th, .order-summary td, .price-summary td { padding: 12px; text-align: left; border-bottom: 1px solid #eeeeee; }
        .order-summary th { background-color: #f8f9fa; }
        .price-summary td:last-child { text-align: right; font-weight: bold; }
        .cta-button { display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #888888; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Thank You For Your Order!</h1>
        </div>
        <div class="content">
            <h2>Hi [User Name],</h2>
            <p>Your order has been confirmed and will be shipped shortly. You can view your order details by clicking the button below.</p>
            <p><strong>Order ID:</strong> [Order ID]<br><strong>Order Date:</strong> [Order Date]</p>
            
            <h3>Order Summary</h3>
            <table class="order-summary">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    [Items Table]
                </tbody>
            </table>
            
            <table class="price-summary">
                <tbody>
                    <tr><td>Subtotal:</td><td>₹[Subtotal]</td></tr>
                    <tr><td>Shipping:</td><td>₹[Shipping]</td></tr>
                    <tr><td>Tax:</td><td>₹[Tax]</td></tr>
                    <tr><td><strong>Total:</strong></td><td><strong>₹[Total Price]</strong></td></tr>
                </tbody>
            </table>

            <a href="[Order Details Link]" class="cta-button">View Order Details</a>
        </div>
        <div class="footer">
            <p>&copy; [Year] [Company Name]. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
    // Create table rows for each item in the order
    const itemsHtml = savedOrder.orderItems
      .map(
        (item) => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
            </tr>
        `
      )
      .join("");

    // Replace all placeholders
    emailHtml = emailHtml.replace(
      "[User Name]",
      savedOrder.shippingAddress.name
    );
    emailHtml = emailHtml.replace("[Order ID]", savedOrder._id);
    emailHtml = emailHtml.replace(
      "[Order Date]",
      new Date(savedOrder.createdAt).toLocaleDateString()
    );
    emailHtml = emailHtml.replace("[Items Table]", itemsHtml);
    emailHtml = emailHtml.replace(
      "[Subtotal]",
      savedOrder.itemsPrice.toFixed(2)
    );
    emailHtml = emailHtml.replace(
      "[Shipping]",
      savedOrder.shippingPrice.toFixed(2)
    );
    emailHtml = emailHtml.replace("[Tax]", savedOrder.taxPrice.toFixed(2));
    emailHtml = emailHtml.replace(
      "[Total Price]",
      savedOrder.totalPrice.toFixed(2)
    );
    emailHtml = emailHtml.replace(
      "[Order Details Link]",
      `${process.env.FRONTEND_URL}/orders/${savedOrder._id}`
    );
    emailHtml = emailHtml.replace("[Year]", new Date().getFullYear());
    emailHtml = emailHtml.replace("[Company Name]", 'GadgetGrove');

    await sendEmail({
      email: savedOrder.paymentResult.email_address,
      subject: `Order Confirmed - #${savedOrder._id}`,
      message: emailHtml,
    });

    res.status(201).json({
      message: "Payment verified successfully and order created!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Server error while verifying payment." });
  }
};
// backend/controllers/paymentController.js
const sendPaymentFailedEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Get user from auth middleware
        let emailHtml = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .wrapper { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; color: #333; text-align: center; }
        .cta-button { display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #888888; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header"><h1>Payment Failed</h1></div>
        <div class="content">
            <h2>Hi [User Name],</h2>
            <p>We're sorry, but we were unable to process your payment for your recent order attempt. The items are still in your cart.</p>
            <p>Please try again with a different payment method or contact our support if the issue persists.</p>
            <a href="[Cart Link]" class="cta-button">Return to Cart & Retry</a>
        </div>
        <div class="footer">
            <p>&copy; [Year] [Company Name]. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
        // Replace placeholders...
        emailHtml = emailHtml.replace("[User Name]", user.name);
        emailHtml = emailHtml.replace("[Cart Link]", `${process.env.FRONTEND_URL}/cart`);
        emailHtml = emailHtml.replace("[Year]", new Date().getFullYear());
        emailHtml = emailHtml.replace("[Company Name]", 'GadgetGrove');
        // Send email using the utility function
        await sendEmail({ email: user.email, subject: 'Your Payment Attempt Failed', message: emailHtml });
        res.status(200).send("Payment failed email sent successfully.");
    } catch (error) {
        res.status(500).send("Failed to send payment failed email.");
    }
};
module.exports = { createOrder, verifyPaymentAndSaveOrder, sendPaymentFailedEmail};
