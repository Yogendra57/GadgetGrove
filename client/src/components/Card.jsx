import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/Card.css";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { addItem, removeItem, setCart } from "../redux/cartSlice";
import api from "../utils/api";
import { toast } from "react-toastify";

const Card = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleProduct = () => {
    navigate(`/products/${props._id}`);
  };
  const handleAddtoCart = async () => {
    try {
      const res = await api.post(
        "/cart",
        {
          productId: props._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setCart(res.data.cart.cartItems));
      toast.success("Item added to cart successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart.");
      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCart(res.data.cart.cartItems));
    }
  };
  const handleRemovetoCart = async () => {
    try {
      const res = await api.delete(`cart/items/${props._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCart(res.data.cart.cartItems));
      toast.success("Item removed from cart successfully!");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to remove item from cart.");
      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCart(res.data.cart.cartItems));
    }
  };
  const StarRatingDisplay = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} color="gold" />);
  }

  // Add half star if applicable
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" color="gold" />);
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} color="gold" />);
  }

  return <div className="d-flex align-items-center">{stars}</div>;
};
  return (
    <div className="col" onClick={handleProduct} style={{ cursor: "pointer" }}>
      <div className="product-card bg-white rounded-4 shadow-sm h-100 position-relative">
        {props.countInStock === 0 ? (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        ):(
        <span className="badge bg-danger">New</span>)}
        <div className="overflow-hidden">
          <img
            src={`${BACKEND_URL}/${props.image[0]}`}
            className="product-image w-100"
            alt="Product"
            style={{ height: "200px", objectFit: "contain" }}
          />
        </div>
        <div className="p-4">
          <h5 className="fw-bold mb-1">{props.title}</h5>
          <span>{props.brand}</span>
          <div className="d-flex align-items-center mb-3">
            <div className="me-2">
              <StarRatingDisplay rating={props.rating} />
            </div>
            {props.rating == 0 ? (
              <small className="text-muted">No ratings Yet</small>
            ) : (
              <small className="text-muted">({props.rating.toFixed(1)}/5)</small>
            )}
          </div>
          <p className="text-muted mb-4 product-description">{props.text}</p>
          {props.fromcomp === "cart" && (
            <span className="quantity">Quantity: {props.quantity}</span>
          )}
          <div className="d-flex justify-content-between align-items-center">
            <span className="price">₹{props.price}</span>

            {props.fromcomp === "cart" && (
              <button
                className="btn btn-custom text-white px-4 py-2 rounded-pill"
                onClick={(e) => {
                  e.stopPropagation(); // 🔑 Stop the parent onClick
                  handleRemovetoCart();
                }}
              >
                Remove from Cart
              </button>
            )}
            {props.fromcomp === "product" && (
              <button
                className="btn btn-custom text-white px-4 py-2 rounded-pill"
                onClick={(e) => {
                  e.stopPropagation(); // 🔑 Stop the parent onClick
                  handleAddtoCart();
                }}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
