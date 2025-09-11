
// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {  isAdmin } = require('../middleware/authMiddleware');
const {verifyToken}=require('../config/jwt') 
const upload = require('../middleware/upload'); 
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    featuredProducts,
    getLowStockProducts
} = require('../controllers/productController');

// --- Routes ---

// Public routes (no auth middleware or modified auth)
router.get('/',verifyToken, getProducts);
router.get('/low-stock', verifyToken, isAdmin, getLowStockProducts); 
router.get('/featured-products', featuredProducts);
router.get('/:id',verifyToken, getProductById); 

// Admin-only routes with file uploads
router.post(
    '/',
    verifyToken,
    isAdmin,
    upload.array('images', 5), // Middleware for multiple images (field name 'images', max 5 files)
    createProduct
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    upload.array('images', 5),
    updateProduct
);

router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;