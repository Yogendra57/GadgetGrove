
import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../redux/cartSlice";
import Card from "./Card";
import LeftSidebar from "./LeftSidebar";
import BottomNavbar from "./BottomNavbar";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useCountUp from "../hooks/useCountUp";
import "../stylesheets/CartPage.css";
import "../stylesheets/ResponsiveNavbar.css";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
const outOfStockItems = useMemo(() => {
    return cartItems.filter(item => item.product && item.product.countInStock === 0);
  }, [cartItems]);
   const isCheckoutDisabled = outOfStockItems.length > 0;
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setCart(res.data.cart.cartItems));
      } catch (error) {
        console.error(error);
        setError("Error fetching cart data.");
        toast.error("Failed to fetch cart data.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCart();
    else {
      toast.error("You are not authenticated. Please log in.");
      setError("You are not authenticated.");
      setLoading(false);
    }
  }, [token, dispatch]);

  // Calculate Totals with safety check
  const { totalQuantity, totalPrice } = useMemo(() => {
    let quantity = 0;
    let price = 0;
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach((item) => {
        // --- FIX: Add check to ensure item.product exists ---
        if (item.product) {
          quantity += item.quantity;
          price += item.quantity * item.product.price;
        }
      });
    }
    return { totalQuantity: quantity, totalPrice: price };
  }, [cartItems]);

  // Apply Count-Up Animation Hooks
  const animatedTotalQuantity = useCountUp(totalQuantity, 800);
  const animatedTotalPrice = useCountUp(totalPrice, 1000);

  // --- Cart Content Rendering Logic ---
  const renderCartContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    
    // --- FIX: Filter out items where product data might be null ---
    const validCartItems = cartItems.filter(item => item.product);

    if (!validCartItems || validCartItems.length === 0) {
      return <Alert variant="info">Your shopping cart is empty.</Alert>;
    }

    return (
      <Row>
        {validCartItems.map((item) => (
          <Col
            key={item.product._id}
            sm={12}
            md={6}
            lg={4}
            xl={4}
            className="mb-4 d-flex align-items-stretch card-fade-in"
          >
            <Card
              _id={item.product._id}
              image={item.product.image}
              title={item.product.name}
              text={item.product.description}
              brand={item.product.brand}
              category={item.product.category}
              price={item.product.price}
              rating={item.product.rating}
              link={`/product/${item.product._id}`}
              quantity={item.quantity}
              fromcomp="cart"
              countInStock={item.product.countInStock}
              
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container fluid>
      <Row>
        {/* --- Sidebar Column (Desktop Only) --- */}
        <Col md={2} lg={2} className="desktop-sidebar bg-light vh-100 p-0 shadow-sm sticky-top">
          <LeftSidebar />
        </Col>

        {/* --- Cart Content Column --- */}
        <Col md={10} lg={10} className="main-content-area">
          <div className="p-4">
            <h2 className="mb-4 fw-bold page-title-animation">My Cart</h2>
                        {isCheckoutDisabled && (
              <Alert variant="danger">
                One or more items in your cart are out of stock. Please remove them to proceed to checkout.
              </Alert>
            )}

            {/* --- Summary Header --- */}
            {!loading && !error && cartItems.length > 0 && (
              <div className="cart-summary-bar mb-4 p-3 rounded-3 shadow-sm">
                <Row className="align-items-center gy-3">
                  <Col md={3} sm={6}>
                    <div className="summary-item">
                      <div className="summary-label text-muted">Total Items</div>
                      <div className="summary-value display-6 fw-bold">
                        {animatedTotalQuantity}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="summary-item">
                      <div className="summary-label text-muted">Subtotal</div>
                      <div className="summary-value display-6 fw-bold text-success">
                        &#8377;{animatedTotalPrice.toFixed(2)}
                      </div>
                    </div>
                  </Col>
                  <Col md={5} className="text-md-end text-center">
                    <Button
                      variant="primary"
                      size="lg"
                      className="checkout-button shadow"
                      onClick={() => navigate("/checkout")}
                      disabled={isCheckoutDisabled}
                    >
                      Proceed to Checkout &rarr;
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {renderCartContent()}
          </div>
        </Col>
      </Row>
      
      {/* --- Mobile Bottom Navigation --- */}
      <BottomNavbar />
    </Container>
  );
};

export default Cart;