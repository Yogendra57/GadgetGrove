// src/pages/PlaceOrderPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import LeftSidebar from "../components/LeftSidebar";
import OrderDetails from "../components/OrderDetails";
import PaymentSummary from "../components/PaymentSummary";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../stylesheets/Loader.css";
export default function PlaceOrderPage() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- State from Redux and local component state ---
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const token = localStorage.getItem("token");

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await api.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setCart(cartRes.data.cart.cartItems));

        const addressRes = await api.get("/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(addressRes.data.addresses);
        if (addressRes.data.addresses.length > 0) {
          setSelectedAddressId(addressRes.data.addresses[0]._id);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch page details.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
    else setError("User not authenticated.");
  }, [token, dispatch]);

  // --- Razorpay Script Loader ---
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // --- Price Calculations ---
  const subtotal = cartItems.reduce((acc, item) => {
    if (item.product) {
      // Safety check here
      return acc + item.product.price * item.quantity;
    }
    return acc; // Skip item if product data is missing
  }, 0);
  const shippingFee = subtotal > 500 ? 0 : 40;
  const taxRate = 0.18;
  const taxes = subtotal * taxRate;
  const total = subtotal + shippingFee + taxes;

  // --- Remove Item Handler ---
  const handleRemoveItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setCart(res.data.cart.cartItems));
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item, rolling back...");
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setCart(res.data.cart.cartItems));
    }
  };

  // --- Payment Initiation and Order Placement Handler ---
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }

    try {
      // Step 1: Create Razorpay Order via Backend
      const {
        data: { order },
      } = await api.post(
        "/payment/create-order",
        {
          amount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const selectedShippingAddress = addresses.find(
        (addr) => addr._id === selectedAddressId
      );

      // Step 2: Configure Razorpay Options
      const options = {
        key: "rzp_test_RF4l2HyfnUFssb",
        amount: order.amount,
        currency: "INR",
        name: "GadgetGrove",
        description: "Order Payment Confirmation",
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Prepare data for backend verification
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderDetails: {
              items: cartItems
                .filter((item) => item.product)
                .map((item) => ({
                  product: item.product._id,
                  name: item.product.name,
                  image: item.product.image,
                  price: item.product.price,
                  quantity: item.quantity,
                })),
              shippingAddress: selectedShippingAddress,
              itemsPrice: subtotal,
              taxPrice: taxes,
              shippingPrice: shippingFee,
              totalPrice: total,
            },
          };

          // Step 4: Call backend to verify payment and save order
          const verifyRes = await api.post(
            "/payment/verify-payment",
            verificationData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          toast.success(verifyRes.data.message);
          try {
            await api.delete("/cart/clear", {
              headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(clearCart());
          } catch (cartClearError) {
            console.error("Failed to clear cart on backend:", cartClearError);
          }
          // Clear local cart state after successful order
          navigate(`/order/success/${verifyRes.data.order._id}`);
        },
        prefill: {
          // name: selectedShippingAddress.name,
          // email: user.email, // Get user email from state/Redux
          // contact: selectedShippingAddress.phone,
        },
        theme: {
          color: "#007bff",
        },
      };

      // Step 5: Open Razorpay Modal
      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();

      rzpInstance.on("payment.failed", function (response) {
        api.post(
          "/payment/payment-failed",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.error(`Payment failed: ${response.error.description}`);
        console.error(response.error);
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Could not initiate payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="dot-spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Row>
        <Col
          md={2}
          className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top"
        >
          <LeftSidebar />
        </Col>

        <Col md={7} className="main-content-area py-4 px-md-5">
          {error && <Alert variant="danger">{error}</Alert>}
          <OrderDetails
            addresses={addresses}
            cartItems={cartItems}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onRemoveItem={handleRemoveItem}
          />
        </Col>

        <Col md={3} className="py-4 border-start bg-white vh-100 sticky-top">
          <PaymentSummary
            subtotal={subtotal}
            shippingFee={shippingFee}
            taxes={taxes}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            disabled={cartItems.length === 0 || !selectedAddressId}
          />
        </Col>
      </Row>
      {/* Add BottomNavbar here if using responsive layout */}
    </Container>
  );
}
