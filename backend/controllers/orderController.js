const Address = require('../models/Address');
const Order = require('../models/Order');


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
module.exports = { getOrderById ,getMyOrders,getAllOrders,updateOrderToDelivered};