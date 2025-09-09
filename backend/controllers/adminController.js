// backend/controllers/adminController.js

const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Get total revenue from all paid orders
        const salesData = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = salesData.length > 0 ? salesData[0].totalSales : 0;

        // 2. Get total number of orders
        const totalOrders = await Order.countDocuments();

        // 3. Get total number of customers/users
        const totalUsers = await User.countDocuments({ isAdmin: false });

        // 4. Get number of products out of stock or low stock (e.g., < 10 items)
        const lowStockCount = await Product.countDocuments({ countInStock: { $lte: 10 } });
        
        // 5. Get recent orders to display on dashboard
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalUsers,
            lowStockCount,
            recentOrders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching dashboard data.' });
    }
};
// backend/controllers/userController.js



/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users/all
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users and exclude the password field from being returned
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
};

/**
 * @desc    Delete a user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        if (user.isAdmin) {
            return res.status(400).json({ message: 'Cannot delete an admin account.' });
        }

        // Optional: Add logic here to handle what happens to the user's orders.
        // Option A: Delete orders associated with the user.
        // await Order.deleteMany({ user: req.params.id });

        await User.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'User removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
};
exports.adminlogout=(req,res)=>{
    try {
            res.clearCookie("token");
    return res.status(200).json({message:"Admin logged out successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Server error while logging out"});
    }

}