// import React, { useState } from "react";
// import "../stylesheets/Product.css";
// import { useEffect } from "react";
// import { FaStar } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import { useDispatch } from "react-redux";
// import { setCart } from "../redux/cartSlice";
// const Product = (props) => {
//   const [mainImage, setMainImage] = useState(props.image?.[0]||"");
//   const token=localStorage.getItem('token')
//   const [quantity,setQuantity]=useState(1);
//   const dispatch=useDispatch();
//   const handleWishlist=async()=>{
//     try {
//       const res = await api.post(`/wishlist/${props._id}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if(res.data.message==="Product added to wishlist"){
//         alert("Added to wishlist")
//       }else{
//         alert(res.data.message)
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Failed to add to wishlist");
//     }
//   }
//  const handleAddtoCart = async () => {
    
//     try {
//       const res = await api.post(
//         "/cart",
//         {
//           productId: props._id,
//           quantity: quantity,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       dispatch(setCart(res.data.cart.cartItems));
//     } catch (error) {
//       console.error(error);
//       alert("Failed to add item rolling Back...");
//       const res = await api.get("/cart", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       dispatch(setCart(res.data.cart.cartItems));
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         {/* Left Side: Images */}
//         <div className="col-md-6 mb-4">
//           <img
//             src={mainImage}
//             alt="Product"
//             className="img-fluid rounded mb-3 product-image"
//             style={{ height: "400px", objectFit: "contain" }}
            
//           />

//           <div className="d-flex justify-content-between">
//             {props.image.map((src, index) => (
//               <img
//                 key={index}
//                 src={src}
//                 alt={`Thumbnail ${index + 1}`}
//                 className={`thumbnail rounded ${
//                   mainImage === src ? "active" : ""
//                 }`}
//                 onClick={() => setMainImage(src)} // ✅ React way
//                 style={{ cursor: "pointer", width: "22%", objectFit:'contain' }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right Side: Product Info */}
//         <div className="col-md-6">
//           <h2 className="mb-3">{props.name}</h2>
//           <p className="text-muted mb-4">{props.brand}</p>

//           <div className="mb-3">
//             <span className="h4 me-2">{props.price}</span>
//             <span className="text-muted">
//               <s>{props.price + 200}</s>
//             </span>
//           </div>

//           <div className="mb-3">
//             {[...Array(props.rating)].map((el, i) => {
//               return <FaStar key={i} color="gold" />;
//             })}
//             <span className="ms-2">{props.rating}/5 ({props.numReviews} Reviews)</span>
//           </div>

//           <p className="mb-4">{props.description}</p>

//           {/* <div className="mb-4">
//             <h5>Color:</h5>
//             <div
//               className="btn-group"
//               role="group"
//               aria-label="Color selection"
//             >
//               <input
//                 type="radio"
//                 className="btn-check"
//                 name="color"
//                 id="black"
//                 autoComplete="off"
//                 defaultChecked
//               />
//               <label className="btn btn-outline-dark" htmlFor="black">
//                 Black
//               </label>

//               <input
//                 type="radio"
//                 className="btn-check"
//                 name="color"
//                 id="silver"
//                 autoComplete="off"
//               />
//               <label className="btn btn-outline-secondary" htmlFor="silver">
//                 Silver
//               </label>

//               <input
//                 type="radio"
//                 className="btn-check"
//                 name="color"
//                 id="blue"
//                 autoComplete="off"
//               />
//               <label className="btn btn-outline-primary" htmlFor="blue">
//                 Blue
//               </label>
//             </div>
//           </div> */}

//           <div className="mb-4">
//             <label htmlFor="quantity" className="form-label">
//               Quantity:
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="quantity"
//               defaultValue="1"
//               min="1"
//               onChange={(e)=>setQuantity(e.target.value)}
//               style={{ width: "80px" }}
//             />
//           </div>

//           <button className="btn btn-primary btn-lg mb-3 me-2" onClick={handleAddtoCart}>
//             <i className="bi bi-cart-plus"></i> Add to Cart
//           </button>
//           <button className="btn btn-outline-secondary btn-lg mb-3" onClick={handleWishlist}>
//             <i className="bi bi-heart"></i> Add to Wishlist
//           </button>

//           <div className="mt-4">
//             <h5>Key Features:</h5>
//             <ul>
//             {props.keyFeatures.map((ele,ind)=>{
//               return <li key={ind}>{ele}</li>
//             })}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;
// src/pages/Product.jsx (or a new component wrapping your existing code)

// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../stylesheets/Product.css"; // Ensure you create/update this CSS file
// import { FaStar } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import { useDispatch } from "react-redux";
// import { setCart } from "../redux/cartSlice";

// // Import new sub-components we will create
// import ReviewList from "../components/ReviewList";
// import AddReviewForm from "../components/AddReviewForm";

// const Product = (props) => {
//   // --- Existing State ---
//   const BACKEND_URL = 'http://localhost:8000';
//   const [mainImage, setMainImage] = useState(`${BACKEND_URL}/${props.product.image?.[0] || ""}`);
//   const token = localStorage.getItem('token');
//   const [quantity, setQuantity] = useState(1);
//   const dispatch = useDispatch();

//   // --- New State for Reviews ---
//   // We manage reviews locally to update UI instantly after submission
//   const [reviews, setReviews] = useState(props.product.reviews || []);
//   const [error, setError] = useState("");

// const handleWishlist=async()=>{
//     try {
//       const res = await api.post(`/wishlist/${props.product._id}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if(res.data.message==="Product added to wishlist"){
//         alert("Added to wishlist")
//       }else{
//         alert(res.data.message)
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Failed to add to wishlist");
//     }
//   }
//  const handleAddtoCart = async () => {
    
//     try {
//       const res = await api.post(
//         "/cart",
//         {
//           productId: props.product._id,
//           quantity: quantity,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       dispatch(setCart(res.data.cart.cartItems));
//       alert("Item added to cart");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to add item rolling Back...");
//       const res = await api.get("/cart", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       dispatch(setCart(res.data.cart.cartItems));
//     }
//   };

//   // --- New Review Submission Handler ---
//   const handleReviewSubmitted = (newReview) => {
//     // Optimistically update the UI with the new review
//     setReviews([newReview, ...reviews]);
//     // Optionally: refetch product data from server to ensure sync
//   };

//   return (
//     <div className="container my-5 product-page-container">
//       {/* --- Top Section: Product Details --- */}
//       <div className="row mb-5">
//         {/* Left Side: Images */}
//         <div className="col-lg-6 mb-4">
//           <img
//             src={mainImage || props.product.image?.[0]}
//             alt="Product Main"
//             className="img-fluid rounded mb-3 product-image-main "
//           />
//           <div className="d-flex thumbnail-container">
//             {props.product.image.map((src, index) => (
//               <img
//                 key={index}
//                 src={src}
//                 alt={`Thumbnail ${index + 1}`}
//                 className={`thumbnail rounded shadow-sm ${mainImage === src ? "active" : ""}`}
//                 onClick={() => setMainImage(src)}
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
//           <ReviewList reviews={reviews} />
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

// // Example usage: You would fetch product data and pass it as props
// export default Product;





// src/components/Product.jsx

// import React, { useState } from "react";
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

// const Product = (props) => {
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Define your backend URL

//   // --- State ---
//   // Initialize mainImage state by constructing the full URL for the first image
//   const [mainImage, setMainImage] = useState(
//     props.product.image?.[0] ? `${BACKEND_URL}/${props.product.image[0]}` : ""
//   );
//   const token = localStorage.getItem('token');
//   const [quantity, setQuantity] = useState(1);
//   const dispatch = useDispatch();
//   const [reviews, setReviews] = useState(props.product.reviews || []);

//   const handleWishlist = async () => {
//     // ... (wishlist logic) ...
//   };

//   const handleAddtoCart = async () => {
//     // ... (add to cart logic) ...
//   };

//   const handleReviewSubmitted = (newReview) => {
//     setReviews([newReview, ...reviews]);
//   };

//   // --- Image URL Construction Function ---
//   // Helper function to ensure proper URL formatting
//   const getImageUrl = (path) => {
//     if (!path) return ""; // Return empty string if path is missing
//     if (path.startsWith('http://') || path.startsWith('https://')) {
//       return path; // Return as-is if it's already a full URL
//     }
//     return `${BACKEND_URL}/${path}`;
//   };

//   return (
//     <div className="container my-5 product-page-container">
//       {/* --- Top Section: Product Details --- */}
//       <div className="row mb-5">
//         {/* Left Side: Images */}
//         <div className="col-lg-6 mb-4">
//           <img
//             src={mainImage || getImageUrl(props.product.image?.[0])} // Use helper function for main image
//             alt="Product Main"
//             className="img-fluid rounded mb-3 product-image-main shadow"
//           />
//           <div className="d-flex thumbnail-container">
//             {props.product.image.map((src, index) => (
//               <img
//                 key={index}
//                 src={getImageUrl(src)} // Use helper function for thumbnail images
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
//           <ReviewList reviews={reviews} backendUrl={BACKEND_URL} /> {/* Pass backend URL to ReviewList */}
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



// src/pages/Product.jsx

import React, { useState, useEffect } from "react"; // Import useEffect
import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/Product.css";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";

// Import new sub-components we will create
import ReviewList from "../components/ReviewList";
import AddReviewForm from "../components/AddReviewForm";
import { toast } from "react-toastify";

const Product = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const navigate = useNavigate(); // Initialize navigate

  // --- State ---
  const [mainImage, setMainImage] = useState("");
  const token = localStorage.getItem('token');
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);

  // --- Effects ---
  useEffect(() => {
    // Update state when props.product changes (e.g., initial load)
    if (props.product) {
      setReviews(props.product.reviews || []);
      setMainImage(getImageUrl(props.product.image?.[0]));
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
  // Function to refresh all reviews by refetching product data from the server.
  // This ensures the UI is consistent after any edit, add, or delete action.
  const refreshReviews = async () => {
    try {
      const res = await api.get(`/products/${props.product._id}`);
      setReviews(res.data.product.reviews);
      
    } catch (error) {
      toast.error("Failed to refresh reviews.");
      console.error("Could not refresh reviews", error);
    }
  };
  
  const handleReviewSubmitted = () => {
    refreshReviews(); // Call refresh function to update list with new review
  };

  // --- Image URL Construction Function ---
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${BACKEND_URL}/${path}`;
  };

  return (
    <div className="container my-5 product-page-container">
      {/* --- Top Section: Product Details --- */}
      <div className="row mb-5">
        {/* Left Side: Images */}
        <div className="col-lg-6 mb-4">
          <img
            src={mainImage}
            alt="Product Main"
            className="img-fluid rounded mb-3 product-image-main"
          />
          <div className="d-flex thumbnail-container">
            {props.product.image.map((src, index) => (
              <img
                key={index}
                src={getImageUrl(src)}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail rounded shadow-sm ${mainImage === getImageUrl(src) ? "active" : ""}`}
                onClick={() => setMainImage(getImageUrl(src))}
                style={{ objectFit: "contain" }}
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
          <div className="mb-3 d-flex align-items-center">
            <StarRatingDisplay rating={props.product.rating} />
            <span className="ms-2 text-muted">({props.product.numReviews} Reviews)</span>
          </div>
          <p className="mb-4 lead fs-6">{props.product.description}</p>
          <div className="mb-4">
            <label htmlFor="quantity" className="form-label fw-bold">Quantity:</label>
            <input type="number" className="form-control quantity-input" id="quantity" defaultValue="1" min="1" onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="action-buttons">
            <button className="btn btn-primary btn-lg mb-3 me-2" onClick={handleAddtoCart}>Add to Cart</button>
            <button className="btn btn-outline-danger btn-lg mb-3" onClick={handleWishlist}>Add to Wishlist</button>
          </div>
          <div className="mt-4 key-features">
            <h5 className="fw-bold">Key Features:</h5>
            <ul>
              {props.product.keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Reviews --- */}
      <hr className="my-5" />
      <div className="row review-section">
        <div className="col-lg-7 pe-lg-5">
          <h3 className="mb-4 fw-bold">Customer Reviews</h3>
          {/* --- FIX: Pass required props to ReviewList --- */}
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
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FaStar key={i} color={i <= rating ? "#ffc107" : "#e4e5e9"} />
    );
  }
  return <div>{stars}</div>;
};

export default Product;