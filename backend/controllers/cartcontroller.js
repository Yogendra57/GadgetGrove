const Product = require("../models/Product");
const Cart = require("../models/Cart");

// get cart

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",'name image price brand category description rating countInStock'
    );
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [],
      });
    }
    return res.status(200).json({ message: "Cart fetch successfully", cart });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({
        error: "Internal Server Error while fetching cart items try agian!",
      });
  }
};

//Add to cart
const addTocart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({
        message: "Product id and quantity is required to add product to cart.",
      });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [],
      });
    }
    const index = cart.cartItems.findIndex(
      (i) => i.product.toString() === productId
    );
    if (index > -1) {
      cart.cartItems[index].quantity += quantity;
      if (cart.cartItems[index].quantity > product.countInStock) {
        cart.cartItems[index].quantity = product.countInStock;
      }
    } else {
      cart.cartItems.push({
        product: productId,
        quantity: Math.min(quantity, product.countInStock),
      });
    }
    await cart.save();
    const updatecart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",'name image price brand category description rating countInStock'
    );
    return res
      .status(200)
      .json({
        message: "Product added to cart Successfully",
        cart: updatecart,
      });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server error try again" });
  }
};
//update quatity
const Updatequantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (!productId || quantity == null || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "ProductId and valid quantity are required." });
  }
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart is not found" });
    }
    const index = cart.cartItems.findIndex(
      (i) => i.product.toString() === productId
    );
    if (index === -1) {
      return res.status(404).json({ message: "Product is not found in cart" });
    }
    cart.cartItems[index].quantity = quantity;
    await cart.save();
    const updatecart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product"
    );
    return res
      .status(200)
      .json({ message: "Cart updated successfully", cart: updatecart });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server error try again" });
  }
};
//delete from cart
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res
      .status(400)
      .json({ message: "Product id is required to delete" });
  }
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "cart not found" });
    }
    cart.cartItems = cart.cartItems.filter(
      (i) => i.product.toString() !== productId
    );
    await cart.save();
    const updatedcart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",
      'name image price brand category description rating countInStock'
    );
    return res
      .status(200)
      .json({ message: "Item removed successfully", cart: updatedcart });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server error to delete product from cart" });
  }
};
//clear cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.cartItems = [];
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",'name image price brand category description rating countInStock'
    );
    return res
      .status(200)
      .json({ message: "Cart cleared successfully", cart: updatedCart });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({
        message: "Internal server error While clearing your cart try again",
      });
  }
};
module.exports = {
  clearCart,
  addTocart,
  deleteProduct,
  getCart,
  Updatequantity,
};
