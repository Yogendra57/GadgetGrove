// // src/pages/WishlistPage.jsx

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import LeftSidebar from "../components/LeftSidebar"; // Import sidebar component
// import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
// import "../stylesheets/WishlistPage.css";
// import api from "../utils/api";
// import { setCart } from "../redux/cartSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function WishlistPage() {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const token = localStorage.getItem("token");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteloading, setDeleteLoading] = useState(true);
//   const dispatch = useDispatch();
//   const Navigate = useNavigate();
//   // Fetch wishlist items on component load
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const response = await api.get("/wishlist", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setWishlistItems(response.data.products);
//       } catch (error) {
//         console.error("Failed to fetch wishlist:", error);
//         setError("Failed to load wishlist.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   // Handler to remove item from wishlist state
//  const handleRemoveItem = async (itemId) => {
//   try {
//     setDeleteLoading(itemId); // Track current deleting item
//     await api.delete(`/wishlist/${itemId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setWishlistItems((prevItems) =>
//       prevItems.filter((item) => item._id !== itemId)
//     );
//   } catch (error) {
//     setError("Failed to remove item from wishlist.");
//     console.error("Failed to remove item from wishlist:", error);
//     alert("Failed to remove item. Please try again.");
//   } finally {
//     setDeleteLoading(false);
//   }
// };
//   // Handler to move item to cart (removes from wishlist)
//   const handleMoveToCart = async (itemId) => {
//   try {
//     setDeleteLoading(itemId); // Track current processing item
//     const res = await api.post(
//       "/cart",
//       { productId: itemId, quantity: 1 },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     dispatch(setCart(res.data.cart.cartItems));

//     await api.delete(`/wishlist/${itemId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setWishlistItems((prevItems) =>
//       prevItems.filter((item) => item._id !== itemId)
//     );
//   } catch (error) {
//     console.error(error);
//     alert("Failed to add item to cart. Rolling back...");
//   } finally {
//     setDeleteLoading(false);
//   }
// };
//   if (loading) {
//     return (
//       <div className="text-center my-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center my-5 text-danger">{error}</div>;
//   }


//   return (
//     <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
//       <Row>
//         {/* 1. Left Sidebar Navigation */}
//         <Col md={2} className="bg-white vh-100 shadow-sm p-0 sticky-top">
//           {/* Ensure the Wishlist link is set to active in LeftSidebar */}
//           <LeftSidebar />
//         </Col>

//         {/* 2. Main Content Area */}
//         <Col md={10} className="py-4 px-md-5">
//           <Container>
//             <div className="mb-4">
//               <h2 className="h4 fw-bold">
//                 My Wishlist ({wishlistItems.length})
//               </h2>
//             </div>

//             {/* Wishlist Items Grid */}
//             <Row className="gy-4">
//               {wishlistItems.length > 0 ? (
//                 wishlistItems.map((item) => (
//                   <Col key={item._id} sm={6} md={4} lg={3}>
//                     <Card className="h-100 shadow-sm border-0 product-card" onClick={()=>Navigate(`/products/${item._id}`)} style={{ cursor: "pointer" }}>
//                       {/* Image container for zoom effect */}
//                       <div className="product-card-image-container rounded-top">
//                         <Card.Img
//                           variant="top"
//                           src={item.image[0]}
//                           alt={item.name}
//                         />
//                         {/* {!item.inStock && (
//                           <div className="out-of-stock-overlay">Out of Stock</div>
//                         )} */}
//                       </div>

//                       <Card.Body className="d-flex flex-column pb-0">
//                         <Card.Title
//                           as="h6"
//                           className="text-truncate"
//                           title={item.name}
//                         >
//                           {item.name}
//                         </Card.Title>
//                         <Card.Text className="fw-bold mt-auto mb-2 fs-5 text-dark">
//                           ${item.price.toFixed(2)}
//                         </Card.Text>
//                       </Card.Body>

//                       <Card.Footer className="bg-white border-0 pt-0 pb-3 px-3">
//                         <Button
//                           variant="primary"
//                           className="w-100 mb-2 d-flex align-items-center justify-content-center"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleMoveToCart(item._id)
//                           }}
//                           disabled={deleteloading === item._id}
//                           //   disabled={!item.inStock}
//                         >
//                           <FaShoppingCart className="me-2" /> {deleteloading === item._id ? "Processing..." : "Move to Cart"}
//                         </Button>
//                         <Button
//                           variant="outline-secondary"
//                           size="sm"
//                           className="w-100 d-flex align-items-center justify-content-center"
//                           onClick={(e) =>{
//                             e.stopPropagation();
//                             handleRemoveItem(item._id);
//                           }}
//                           disabled={deleteloading === item._id}
//                         >
//                           <FaTrashAlt className="me-2" /> {deleteloading === item._id ? "Removing..." : "Remove"}
//                         </Button>
//                       </Card.Footer>
//                     </Card>
//                   </Col>
//                 ))
//               ) : (
//                 <Col>
//                   <Card body className="text-center text-muted py-5">
//                     Your wishlist is empty. Continue shopping to add items!
//                   </Card>
//                 </Col>
//               )}
//             </Row>
//           </Container>
//         </Col>
//       </Row>
//     </Container>
//   );
// }


// src/pages/WishlistPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import LeftSidebar from "../components/LeftSidebar";
import BottomNavbar from "../components/BottomNavbar"; // Import mobile bottom navbar
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import "../stylesheets/WishlistPage.css";
import "../stylesheets/ResponsiveNavbar.css"; // Import responsive styles
import api from "../utils/api";
import { setCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
  const [wishlistItems, setWishlistItems] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteloading, setDeleteLoading] = useState(null); // Changed to store ID or boolean false
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  // Fetch wishlist items on component load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get("/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(response.data.products);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };
    if (token) {
        fetchWishlist();
    } else {
        setError("User not authenticated.");
        setLoading(false);
    }
  }, [token]); // Added token dependency

  // Handler to remove item from wishlist state
  const handleRemoveItem = async (itemId) => {
    try {
      setDeleteLoading(itemId); // Track current deleting item
      await api.delete(`/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
      toast.success("Item removed from wishlist.");
    } catch (error) {
      setError("Failed to remove item from wishlist.");
      console.error("Failed to remove item from wishlist:", error);
      toast.error("Failed to remove item. Please try again.");
    } finally {
      setDeleteLoading(null); // Reset loading state
    }
  };

  // Handler to move item to cart (removes from wishlist)
  const handleMoveToCart = async (itemId) => {
    try {
      setDeleteLoading(itemId); // Track current processing item
      const res = await api.post(
        "/cart",
        { productId: itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setCart(res.data.cart.cartItems));

      await api.delete(`/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
      toast.success("Item moved to cart.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart. Rolling back...");
    } finally {
      setDeleteLoading(null); // Reset loading state
    }
  };

  // Loading and Error States Rendering
  if (loading) {
    return (
      <Container fluid>
        <Row>
            <Col md={2} className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top">
                <LeftSidebar />
            </Col>
            <Col md={10} className="main-content-area d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Col>
        </Row>
        <BottomNavbar />
      </Container>
    );
  }

  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Row>
        {/* 1. Left Sidebar Navigation (Desktop Only) */}
        <Col md={2} className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top">
          <LeftSidebar />
        </Col>

        {/* 2. Main Content Area */}
        <Col md={10} className="main-content-area py-4 px-md-5">
          <Container>
            <div className="mb-4">
              <h2 className="h4 fw-bold">
                My Wishlist ({wishlistItems.length})
              </h2>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Wishlist Items Grid */}
            <Row className="gy-4">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <Col key={item._id} sm={6} md={4} lg={3}>
                    <Card
                      className="h-100 shadow-sm border-0 product-card"
                      onClick={() => Navigate(`/products/${item._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="product-card-image-container rounded-top">
                        <Card.Img
                          variant="top"
                          src={`${BACKEND_URL}/${item.image[0]}`}
                          alt={item.name}
                        />
                      </div>

                      <Card.Body className="d-flex flex-column pb-0">
                        <Card.Title as="h6" className="text-truncate" title={item.name}>
                          {item.name}
                        </Card.Title>
                        <Card.Text className="fw-bold mt-auto mb-2 fs-5 text-dark">
                          &#8377;{item.price.toFixed(2)}
                        </Card.Text>
                      </Card.Body>

                      <Card.Footer className="bg-white border-0 pt-0 pb-3 px-3">
                        <Button
                          variant="primary"
                          className="w-100 mb-2 d-flex align-items-center justify-content-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveToCart(item._id);
                          }}
                          disabled={deleteloading === item._id}
                        >
                          <FaShoppingCart className="me-2" />{" "}
                          {deleteloading === item._id ? "Processing..." : "Move to Cart"}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="w-100 d-flex align-items-center justify-content-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item._id);
                          }}
                          disabled={deleteloading === item._id}
                        >
                          <FaTrashAlt className="me-2" />{" "}
                          {deleteloading === item._id ? "Removing..." : "Remove"}
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <Card body className="text-center text-muted py-5">
                    Your wishlist is empty. Continue shopping to add items!
                  </Card>
                </Col>
              )}
            </Row>
          </Container>
        </Col>
      </Row>

      {/* 3. Mobile Bottom Navigation Bar */}
      <BottomNavbar />
    </Container>
  );
}