const express = require('express');
const router = express.Router();
const { getProductById,addReview,updateReview,deleteReview } = require('../controllers/reviewController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../config/jwt');

// Get product with reviews
router.get('/:id', getProductById);

// Add review
router.post('/:id/reviews',verifyToken, upload.single('image'), addReview);
router.put('/:productId/reviews/:reviewId', verifyToken, updateReview);
router.delete('/:productId/reviews/:reviewId', verifyToken, deleteReview);

module.exports = router;
