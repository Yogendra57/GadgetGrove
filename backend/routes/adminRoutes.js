// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../config/jwt');
const {isAdmin} = require('../middleware/authMiddleware');
const { getDashboardStats,getAllUsers, deleteUser,adminlogout } = require('../controllers/adminController');

// GET /api/admin/stats - Dashboard summary route
router.get('/stats', verifyToken, isAdmin, getDashboardStats);
// GET /api/users/all - Get all users list
router.get('/all', verifyToken, isAdmin, getAllUsers);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', verifyToken, isAdmin, deleteUser);
router.post('/logout',verifyToken,isAdmin,adminlogout);

module.exports = router;