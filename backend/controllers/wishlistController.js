const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Add product to wishlist
const addTowishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const exists = wishlist.products.some(p => p.toString() === productId);
    if (exists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    return res.status(200).json({ message: 'Product added to wishlist', wishlist });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add product to wishlist' });
  }
};

// Remove product from wishlist
const removeFromwishList = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const product = await Product.findById(productId); // Await was missing
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id }); // Await was missing
    if (!wishlist) {
      return res.status(404).json({ message: 'No wishlist found' });
    }

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();

    return res.status(200).json({ message: 'Product removed from wishlist' });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal Server Error failed to remove product from wishlist' });
  }
};

// Get user's wishlist
const getwishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(200).json({ message: 'No items in wishlist', products: [] });
    }

    return res.status(200).json({ message: 'Wishlist fetched successfully', products: wishlist.products });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal Server Error failed to fetch wishlist' });
  }
};

module.exports = { getwishlist, addTowishlist, removeFromwishList };
