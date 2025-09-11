const Address = require('../models/Address');
const Order = require('../models/Order');
const Product = require('../models/Product');
const puppeteer = require('puppeteer-core');
const generateInvoiceHTML = require('../utils/invoiceTemplate');

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check if the logged-in user owns this order (or if user is admin)
            if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
            res.status(200).json({ order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const getMyOrders = async (req, res) => {
    try {
        // Find orders where the 'user' field matches the ID from the auth middleware
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching orders.' });
    }
};
const getAllOrders = async (req, res) => {
    try {
        // Fetch all orders, sort by newest first, and populate user's name/email
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching all orders.' });
    }
};

// --- Update Order Status to Delivered (for Admin) ---
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {

            // Check if the order is already delivered to prevent updating stock multiple times
            if (order.isDelivered) {
                return res.status(400).json({ message: 'Order is already marked as delivered.' });
            }

            // Loop through each item in the order to update stock levels
            for (const item of order.orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    // Decrement the stock count by the quantity purchased in the order
                    product.countInStock -= item.quantity;
                    await product.save();
                }
            }
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.status(200).json({ message: 'Order marked as delivered.', order: updatedOrder });
        } else {
            res.status(404).json({ message: 'Order not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating order status.' });
    }
};
const downloadInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Authorization check (optional but recommended)
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const logoUrl = `${process.env.BACKEND_URL}/uploads/logo2.png`;
        // Populate the HTML template with order data
        let htmlContent = generateInvoiceHTML(order);
        // Replace logo placeholder with a public URL from your .env
        htmlContent = htmlContent.replace('[Logo URL]', logoUrl);

                const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ message: 'Server error while generating invoice.' });
    }
};
module.exports = { getOrderById ,getMyOrders,getAllOrders,updateOrderToDelivered,downloadInvoice};
