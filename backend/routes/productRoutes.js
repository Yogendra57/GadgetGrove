// const Product=require('../models/Product');
// const express=require('express');
// const router=express.Router();
// const{verifyToken}=require('../config/jwt');
// const{isAdmin}=require('../middleware/authMiddleware')

// const {getProducts,getProductById,createProduct,updateProduct,deleteProduct, featuredProducts}=require('../controllers/productController')
// // Get All Products: GET /api/products
// router.get('/',verifyToken,getProducts);
// router.get('/featured-products',featuredProducts)

// // Create Product: POST /api/products (Admin only). 
// router.post('/',verifyToken,isAdmin,createProduct);

// // Get Single Product: GET /api/products/:id
// router.get('/:id',verifyToken,getProductById);

// // Update Product: PUT /api/products/:id (Admin only)
// router.put('/:id',verifyToken,isAdmin,updateProduct);

// // Delete Product: DELETE /api/products/:id (Admin only)
// router.delete('/:id',verifyToken,isAdmin,deleteProduct);



// module.exports=router;


// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {  isAdmin } = require('../middleware/authMiddleware');
const {verifyToken}=require('../config/jwt') // Assuming auth middleware file path
const upload = require('../middleware/upload'); // Import your Multer config

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    featuredProducts
} = require('../controllers/productController');

// --- Routes ---

// Public routes (no auth middleware or modified auth)
router.get('/', getProducts); // Keep public or add auth based on your app logic
router.get('/featured-products', featuredProducts);
router.get('/:id', getProductById); // Keep public or add auth based on your app logic

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
    upload.array('images', 5), // Allow image updates
    updateProduct
);

router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;