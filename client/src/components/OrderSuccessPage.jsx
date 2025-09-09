// src/pages/OrderSuccessPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Image, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaArrowLeft, FaEye } from 'react-icons/fa';
import api from '../utils/api';
import LeftSidebar from '../components/LeftSidebar'; // Assuming you have this
import BottomNavbar from '../components/BottomNavbar'; // Assuming you have this
import '../stylesheets/OrderSuccessPage.css'; // New CSS file for styling
import { toast } from 'react-toastify';

export default function OrderSuccessPage() {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!token) {
          setError("You are not authenticated.");
          toast.error("You are not authenticated.");
          setLoading(false);
          return;
        }
        const { data } = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(data.order);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Could not load order details.");
        toast.error("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrderDetails();
    }
    else{
      setError("No order ID provided.");
      toast.error("No order ID provided.");
      setLoading(false);
    }
  }, [orderId, token]);

  // --- Loading and Error States ---
  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5 text-center">
        <Alert variant="danger" className="mx-auto" style={{ maxWidth: '600px' }}>
          {error}
          <div className="mt-3">
            <Link to="/products" className="btn btn-primary"><FaArrowLeft className="me-2" /> Continue Shopping</Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container fluid className="py-5 text-center">
        <Alert variant="warning" className="mx-auto" style={{ maxWidth: '600px' }}>
          Order not found.
          <div className="mt-3">
            <Link to="/products" className="btn btn-primary"><FaArrowLeft className="me-2" /> Continue Shopping</Link>
          </div>
        </Alert>
      </Container>
    );
  }

  // --- Main Render for Success Page ---
  return (
    <Container fluid className="order-success-page-wrapper">
      <Row>
        <Col md={2} className="desktop-sidebar p-0">
          <LeftSidebar />
        </Col>

        <Col md={10} className="main-content-area py-5 d-flex justify-content-center align-items-center">
          <Card className="order-success-card shadow-lg animate__animated animate__fadeInUp">
            <Card.Body className="p-4 p-md-5 text-center">
              <div className="icon-wrapper mb-4 animate__animated animate__bounceIn">
                <FaCheckCircle className="text-success" />
              </div>
              <h1 className="card-title mb-3 animate__animated animate__fadeInDown">Order Confirmed!</h1>
              <p className="lead text-muted mb-4 animate__animated animate__fadeIn">
                Thank you for your purchase! Your order <strong className="text-primary">#{order._id.substring(0, 10)}...</strong> has been placed.
              </p>

              {/* --- Order Summary (Collapsible or just a few items) --- */}
              <Card className="mb-4 order-items-summary animate__animated animate__zoomIn">
                <Card.Header className="text-start fw-bold">Items in your order ({order.orderItems.length})</Card.Header>
                <ListGroup variant="flush">
                  {order.orderItems.slice(0, 3).map((item, index) => ( // Show first 3 items
                    <ListGroup.Item key={item.product + index} className="d-flex align-items-center">
                      <Image src={`${BACKEND_URL}/${item.image}`}  alt={item.name} thumbnail className="item-thumbnail me-3" />
                      <div className="text-start">
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">{item.quantity} x ₹{item.price.toFixed(2)}</small>
                      </div>
                      <span className="ms-auto fw-bold">₹{(item.quantity * item.price).toFixed(2)}</span>
                    </ListGroup.Item>
                  ))}
                  {order.orderItems.length > 3 && (
                    <ListGroup.Item className="text-center text-muted">
                      + {order.orderItems.length - 3} more items...
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="fw-bold d-flex justify-content-between">
                    <span>Total Paid:</span>
                    <span className="text-primary h5">₹{order.totalPrice.toFixed(2)}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              {/* --- Action Buttons --- */}
              <div className="d-grid gap-3 d-md-block animate__animated animate__fadeInUp">
                <Button as={Link} to="/products" variant="outline-primary" size="lg" className="me-md-3 mb-3 mb-md-0 btn-hover-effect">
                  <FaShoppingBag className="me-2" /> Continue Shopping
                </Button>
                <Button as={Link} to={`/orders/${order._id}`} variant="primary" size="lg" className="btn-hover-effect">
                  <FaEye className="me-2" /> View Order Details
                </Button>
              </div>

              <p className="text-muted small mt-4 animate__animated animate__fadeInUp">
                You will receive an email confirmation shortly.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <BottomNavbar />
    </Container>
  );
}