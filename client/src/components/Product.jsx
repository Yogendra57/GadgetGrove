
// // src/pages/Product.jsx

// import React, { useState, useEffect } from "react"; // Import useEffect
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../stylesheets/Product.css";
// import { FaStar } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import { useDispatch } from "react-redux";
// import { setCart } from "../redux/cartSlice";

// // Import new sub-components we will create
// import ReviewList from "../components/ReviewList";
// import AddReviewForm from "../components/AddReviewForm";
// import { toast } from "react-toastify";

// const Product = (props) => {
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
//   const navigate = useNavigate(); // Initialize navigate

//   // --- State ---
//   const [mainImage, setMainImage] = useState("");
//   const token = localStorage.getItem('token');
//   const [quantity, setQuantity] = useState(1);
//   const dispatch = useDispatch();
//   const [reviews, setReviews] = useState([]);

//   // --- Effects ---
//   useEffect(() => {
//     // Update state when props.product changes (e.g., initial load)
//     if (props.product) {
//       setReviews(props.product.reviews || []);
//       setMainImage(getImageUrl(props.product.image?.[0]));
//     }
//   }, [props.product]);

//   // --- Handlers ---
//   const handleWishlist = async () => {
//     try {
//       await api.post(`/wishlist/${props.product._id}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       toast.success("Added to wishlist");
//     } catch (error) {
//       toast.error("Failed to add to wishlist.");
//       console.error(error);
//     }
//   };

//   const handleAddtoCart = async () => {
//     try {
//       const res = await api.post(
//         "/cart",
//         { productId: props.product._id, quantity: quantity },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       dispatch(setCart(res.data.cart.cartItems));
//       toast.success("Item added to cart successfully!");
      
//     } catch (error) {
//       toast.error("Failed to add item to cart.");
//       console.error(error);
//     }
//   };

//   // --- Review Management Callbacks ---
//   // Function to refresh all reviews by refetching product data from the server.
//   // This ensures the UI is consistent after any edit, add, or delete action.
//   const refreshReviews = async () => {
//     try {
//       const res = await api.get(`/products/${props.product._id}`);
//       setReviews(res.data.product.reviews);
      
//     } catch (error) {
//       toast.error("Failed to refresh reviews.");
//       console.error("Could not refresh reviews", error);
//     }
//   };
  
//   const handleReviewSubmitted = () => {
//     refreshReviews(); // Call refresh function to update list with new review
//   };

//   // --- Image URL Construction Function ---
//   const getImageUrl = (path) => {
//     if (!path) return "";
//     if (path.startsWith('http://') || path.startsWith('https://')) return path;
//     return `${BACKEND_URL}/${path}`;
//   };

//   return (
//     <div className="container my-5 product-page-container">
//       {/* --- Top Section: Product Details --- */}
//       <div className="row mb-5">
//         {/* Left Side: Images */}
//         <div className="col-lg-6 mb-4">
//         <div className="main-image-container mb-3  ">
//           <img
//             src={mainImage}
//             alt="Product Main"
//             className="img-fluid rounded mb-3 product-image-main"
//           />
//           </div>
//           <div className="d-flex thumbnail-container">
//             {props.product.image.map((src, index) => (
//               <img
//                 key={index}
//                 src={getImageUrl(src)}
//                 alt={`Thumbnail ${index + 1}`}
//                 className={`thumbnail rounded shadow-sm ${mainImage === getImageUrl(src) ? "active" : ""}`}
//                 onClick={() => setMainImage(getImageUrl(src))}
//                 style={{ objectFit: "contain" }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right Side: Product Info */}
//         <div className="col-lg-6 product-info">
//           <h2 className="mb-2 display-6 fw-bold">{props.product.name}</h2>
//           <p className="text-muted fs-5 mb-3">{props.product.brand}</p>
//           <div className="mb-3 product-price">
//             <span className="h3 fw-bold me-2">&#8377;{props.product.price}</span>
//             <span className="text-muted text-decoration-line-through">&#8377;{props.product.price + 200}</span>
//           </div>
//           <div className="mb-3 d-flex align-items-center">
//             <StarRatingDisplay rating={props.product.rating} />
//             <span className="ms-2 text-muted">({props.product.numReviews} Reviews)</span>
//           </div>
//           <p className="mb-4 lead fs-6">{props.product.description}</p>
//           <div className="mb-4">
//             <label htmlFor="quantity" className="form-label fw-bold">Quantity:</label>
//             <input type="number" className="form-control quantity-input" id="quantity" defaultValue="1" min="1" onChange={(e) => setQuantity(e.target.value)} />
//           </div>
//           <div className="action-buttons">
//             <button className="btn btn-primary btn-lg mb-3 me-2" onClick={handleAddtoCart}>Add to Cart</button>
//             <button className="btn btn-outline-danger btn-lg mb-3" onClick={handleWishlist}>Add to Wishlist</button>
//           </div>
//           <div className="mt-4 key-features">
//             <h5 className="fw-bold">Key Features:</h5>
//             <ul>
//               {props.product.keyFeatures.map((feature, index) => (
//                 <li key={index}>{feature}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* --- Bottom Section: Reviews --- */}
//       <hr className="my-5" />
//       <div className="row review-section">
//         <div className="col-lg-7 pe-lg-5">
//           <h3 className="mb-4 fw-bold">Customer Reviews</h3>
//           {/* --- FIX: Pass required props to ReviewList --- */}
//           <ReviewList 
//             reviews={reviews} 
//             productId={props.product._id}
//             onReviewUpdate={refreshReviews} 
//           />
//         </div>
//         <div className="col-lg-5 ps-lg-4 border-start-lg">
//           <h3 className="mb-4 fw-bold">Write Your Review</h3>
//           {token ? (
//             <AddReviewForm productId={props.product._id} onReviewSubmitted={handleReviewSubmitted} />
//           ) : (
//             <div className="alert alert-info">Please <a href="/login">login</a> to write a review.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper component to display stars
// const StarRatingDisplay = ({ rating }) => {
//   const stars = [];
//   for (let i = 1; i <= 5; i++) {
//     stars.push(
//       <FaStar key={i} color={i <= rating ? "#ffc107" : "#e4e5e9"} />
//     );
//   }
//   return <div>{stars}</div>;
// };

// export default Product;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/Product.css";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import ReviewList from "../components/ReviewList";
import AddReviewForm from "../components/AddReviewForm";
import { Alert, Button } from "react-bootstrap";
// At the top of src/pages/Product.jsx
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
const Product = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const navigate = useNavigate();

  // --- State ---
  const [mainImage, setMainImage] = useState("");
  const token = localStorage.getItem('token');
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [featuresExpanded, setFeaturesExpanded] = useState(false); // State for expanding features

  // --- Effects ---
  useEffect(() => {
    // Update state when props.product changes
    if (props.product) {
      setReviews(props.product.reviews || []);
      setMainImage(getImageUrl(props.product.image?.[0]));
      setFeaturesExpanded(false); // Reset on new product view
    }
  }, [props.product]);

  // --- Handlers ---
  const handleWishlist = async () => {
    try {
      await api.post(`/wishlist/${props.product._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error("Failed to add to wishlist.");
      console.error(error);
    }
  };

  const handleAddtoCart = async () => {
    try {
      const res = await api.post(
        "/cart",
        { productId: props.product._id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setCart(res.data.cart.cartItems));
      toast.success("Item added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add item to cart.");
      console.error(error);
    }
  };

  // --- Review Management Callbacks ---
  const refreshReviews = async () => {
    try {
      const res = await api.get(`/products/${props.product._id}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data.product.reviews);
    } catch (error) {
      toast.error("Failed to refresh reviews.");
      console.error("Could not refresh reviews", error);
    }
  };
  
  const handleReviewSubmitted = () => {
    refreshReviews();
  };

  // --- Image URL Construction Function ---
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${BACKEND_URL}/${path}`;
  };

  // Determine which features to show
  const featuresToShow = featuresExpanded ? props.product.keyFeatures : props.product.keyFeatures.slice(0, 5);

  return (
    <div className="container my-4 product-page-container">
      {/* --- Top Section: Product Details --- */}
      <div className="row mb-5">
        {/* Left Side: Images */}
        <div className="col-lg-6 mb-4">
          <div className="main-image-container mb-3 ">
            <img
              src={mainImage}
              alt="Product Main"
              className="product-image-main"
            />
          </div>
          <div className="d-flex thumbnail-container">
            {props.product.image.map((src, index) => (
              <img
                key={index}
                src={getImageUrl(src)}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail rounded shadow-sm ${mainImage === getImageUrl(src) ? "active" : ""}`}
                onClick={() => setMainImage(getImageUrl(src))}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="col-lg-6 product-info">
          <h2 className="mb-2 display-6 fw-bold">{props.product.name}</h2>
          <p className="text-muted fs-5 mb-3">{props.product.brand}</p>
          <div className="mb-3 product-price">
            <span className="h3 fw-bold me-2">&#8377;{props.product.price}</span>
            <span className="text-muted text-decoration-line-through">&#8377;{props.product.price + 200}</span>
          </div>
          <div className="mb-1 d-flex align-items-center">
            <StarRatingDisplay rating={props.product.rating} />
            <span className="ms-2 text-muted">({props.product.rating.toFixed(1)} / 5)</span>
          </div>
          <div className="mb-3 d-flex align-items-center ">
            <span className=" text-muted">({props.product.numReviews} Reviews)</span>
          </div>
          <p className="mb-4 lead fs-6">{props.product.description}</p>
           {props.product.countInStock > 0 ? (
            <>
          <div className="mb-4">
            <label htmlFor="quantity" className="form-label fw-bold">Quantity:</label>
            <input type="number" className="form-control quantity-input" id="quantity" defaultValue="1" min="1" onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="action-buttons">
            <button className="btn btn-primary btn-lg mb-3 me-2" onClick={handleAddtoCart}>Add to Cart</button>
            <button className="btn btn-outline-danger btn-lg mb-3" onClick={handleWishlist}>Add to Wishlist</button>
          </div>
          </>
           ):(
            <Alert variant="danger" className="mt-4">
                            Out of Stock
                        </Alert>
           )}
          <div className="mt-4 key-features">
            <h5 className="fw-bold">Key Features:</h5>
            <ul>
              {featuresToShow.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            {props.product.keyFeatures.length > 5 && (
              <Button 
                variant="link" 
                className="p-0 text-decoration-none" 
                onClick={() => setFeaturesExpanded(!featuresExpanded)}
              >
                {featuresExpanded ? 'See Less' : 'See More...'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Reviews --- */}
      <hr className="my-5" />
      <div className="row review-section">
        <div className="col-lg-7 pe-lg-5">
          <h3 className="mb-4 fw-bold">Customer Reviews ({reviews.length})</h3>
          <ReviewList 
            reviews={reviews} 
            productId={props.product._id}
            onReviewUpdate={refreshReviews} 
          />
        </div>
        <div className="col-lg-5 ps-lg-4 border-start-lg">
          <h3 className="mb-4 fw-bold">Write Your Review</h3>
          {token ? (
            <AddReviewForm productId={props.product._id} onReviewSubmitted={handleReviewSubmitted} />
          ) : (
            <div className="alert alert-info">Please <a href="/login">login</a> to write a review.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component to display stars
const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="d-flex align-items-center">
      {/* Create an array of 5 items to map over */}
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        
        return (
          <span key={ratingValue}>
            {/* Logic to determine which star to show */}
            {rating >= ratingValue ? (
              <FaStar color="#ffc107" /> // Full star
            ) : rating >= ratingValue - 0.5 ? (
              <FaStarHalfAlt color="#ffc107" /> // Half star
            ) : (
              <FaRegStar color="#ffc107" /> // Empty star
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Product;