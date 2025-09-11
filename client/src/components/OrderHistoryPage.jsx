// src/pages/OrderHistoryPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import LeftSidebar from "../components/LeftSidebar";
import BottomNavbar from "../components/BottomNavbar";
import { FaEye, FaBox } from "react-icons/fa";
import "../stylesheets/ResponsiveNavbar.css";
import "../stylesheets/OrderHistoryPage.css"; 
import { toast } from "react-toastify";

const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
// --- Skeleton Loader Component ---
const OrderSkeletonLoader = () => {
  return (
    <Card className="mb-3 skeleton-card">
      <Card.Header>
        <Row>
          <Col xs={8}><div className="skeleton-line" style={{ width: '70%', height: '20px' }}></div></Col>
          <Col xs={4}><div className="skeleton-line ms-auto" style={{ width: '90%', height: '20px' }}></div></Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div className="skeleton-thumbnail me-3"></div>
          <div className="flex-grow-1">
            <div className="skeleton-line mb-2" style={{ width: '100%' }}></div>
            <div className="skeleton-line" style={{ width: '40%' }}></div>
          </div>
        </div>
         <div className="d-flex align-items-center">
          <div className="skeleton-thumbnail me-3"></div>
          <div className="flex-grow-1">
            <div className="skeleton-line mb-2" style={{ width: '80%' }}></div>
            <div className="skeleton-line" style={{ width: '30%' }}></div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// --- Order Card Component ---
const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  return (
    <Card className="mb-3 shadow-sm order-history-card animate__animated animate__fadeInUp">
      <Card.Header as="h6" className="d-flex justify-content-between flex-wrap">
        <div>
          <strong>Order ID:</strong> {order._id}
        </div>
        <div className="text-muted">
          <strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            {/* Display first few items */}
            {order.orderItems.slice(0, 2).map(item => (
              <div key={item.product} className="d-flex align-items-center mb-3 order-item-preview">
                <Image src={`${BACKEND_URL}/${item.image}`} alt={item.name} className="order-item-thumbnail me-3" />
                <div>
                  <div className="fw-bold text-dark">{item.name}</div>
                  <small className="text-muted">Qty: {item.quantity} | Price: ₹{item.price.toFixed(2)}</small>
                </div>
              </div>
            ))}
            {order.orderItems.length > 2 && (
              <div className="ms-5 ps-3 text-muted small">+ {order.orderItems.length - 2} more items...</div>
            )}
          </Col>
          <Col md={4} className="d-flex flex-column justify-content-center align-items-md-end text-md-end mt-3 mt-md-0 order-card-actions">
            <h5 className="mb-1 fw-bold">Total: ₹{order.totalPrice.toFixed(2)}</h5>
            <p className={`mb-2 small fw-bold ${order.isDelivered ? 'text-success' : 'text-warning'}`}>
              Status: {order.isDelivered ? 'Delivered' : 'Processing'}
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate(`/orders/${order._id}`)}>
              <FaEye className="me-1" /> View Details
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

// --- Main Page Component ---
export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not retrieve order history.");
        toast.error("Could not retrieve order history.");
      } finally {
        setLoading(false);
      }
    };
    if (token){
      fetchOrders(); 
    } else {
      toast.error("Please login to view orders.");
      setError("Please login to view orders.");
      setLoading(false);
    }
  }, [token]);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="desktop-sidebar bg-light vh-100 p-0 shadow-sm sticky-top">
          <LeftSidebar />
        </Col>

        <Col md={10} className="main-content-area py-4 px-md-5">
          <h2 className="mb-4 fw-bold page-title-animation">My Orders</h2>
          {loading ? (
            <>
              <OrderSkeletonLoader />
              <OrderSkeletonLoader />
            </>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : orders.length === 0 ? (
            <Alert variant="info" className="text-center p-4">
              <FaBox size={40} className="mb-3 text-muted" />
              <h4>No Orders Found</h4>
              <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
              <Button as={Link} to="/products" variant="primary">Start Shopping</Button>
            </Alert>
          ) : (
            orders.map((order) => <OrderCard key={order._id} order={order} />)
          )}
        </Col>
      </Row>
      <BottomNavbar />
    </Container>
  );
}