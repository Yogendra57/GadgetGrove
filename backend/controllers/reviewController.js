const Product = require("../models/Product");
const User = require("../models/User");

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name email"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(userId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = {
      user: userId,
      name: user.name,
      rating: Number(rating),
      comment,
      image: req.file ? req.file.path : null,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    const newReview = product.reviews[product.reviews.length - 1];

    // 2. Send the new review back in the response
    res.status(201).json({
      message: "Review added successfully!",
      review: newReview, // <-- Add this line
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { productId, reviewId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const review = product.reviews.id(reviewId); // Find sub-document by ID
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Authorization check: Ensure user ID from token matches review's user ID
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to edit this review' });
        }

        // Update fields
        review.rating = Number(rating) || review.rating;
        review.comment = comment || review.comment;
        review.updatedAt = Date.now(); // Manually update timestamp if necessary

        // Recalculate product's average rating
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
        
        await product.save();
        res.status(200).json({ message: 'Review updated successfully', review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating review.' });
    }
};

// --- Delete Review Controller ---
const deleteReview = async (req, res) => {
    const { productId, reviewId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const review = product.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Authorization check
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this review' });
        }

        // Remove the review sub-document
      product.reviews.pull(reviewId);
        
        // Recalculate product rating and numReviews
        product.numReviews = product.reviews.length;
        if (product.reviews.length > 0) {
            product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
        } else {
            product.rating = 0;
        }

        await product.save();
        res.status(200).json({ message: 'Review deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting review.' });
    }
};
module.exports = { getProductById, addReview, updateReview,deleteReview };
