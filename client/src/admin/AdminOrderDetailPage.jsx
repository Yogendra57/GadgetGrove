import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Image, Alert, Spinner, Badge } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "./AdminSideBar";
import AdminBottomNavbar from "./AdminBottomNavbar";
import { FaUser, FaPhone, FaCreditCard, FaArrowLeft } from "react-icons/fa";
import "../stylesheets/OrderDetailsPage.css"; // Make sure this CSS file exists
import "../stylesheets/ResponsiveNavbar.css"; // Make sure this CSS file exists
import { toast } from "react-toastify";

// --- Skeleton Loader Component ---
const OrderDetailsSkeleton = () => (
  <Row>
    <Col lg={8}>
      <Card className="mb-3 skeleton-card">
        <Card.Header style={{ height: '50px' }}></Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item style={{ height: '70px' }}></ListGroup.Item>
          <ListGroup.Item style={{ height: '70px' }}></ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
    <Col lg={4}>
      <Card className="mb-3 skeleton-card">
        <Card.Header style={{ height: '50px' }}></Card.Header>
        <Card.Body style={{ height: '150px' }}></Card.Body>
      </Card>
    </Col>
  </Row>
);

// --- Main Page Component ---
export default function AdminOrderDetailPage() {
  const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data.order);
      } catch (err) {
        toast.error("Failed to fetch order details.");
        setError("Failed to fetch order details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId && token) {
      fetchOrderDetails();
    } else {
        toast.error("No order ID provided or user not authenticated.");
      setError("No order ID provided or user not authenticated.");
      setLoading(false); // Stop loading if no token or ID
    }
  }, [orderId, token]);

  const renderContent = () => {
    if (loading) return <OrderDetailsSkeleton />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!order) return <Alert variant="warning">Order not found.</Alert>;

    return (
      <Row className="gy-4 form-step-animation">
        {/* Left Column: Order Items */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header as="h5">Order Items ({order.orderItems.length})</Card.Header>
            <ListGroup variant="flush">
              {order.orderItems.map((item) => (
                <ListGroup.Item key={item.product} className="py-3 px-3">
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <Image 
                        src={`${BACKEND_URL}/${item.image}`} // Ensure full URL construction
                        alt={item.name} 
                        fluid 
                        rounded 
                      />
                    </Col>
                    <Col xs={9} md={10}>
                      <Link to={`/products/${item.product}`} className="text-decoration-none text-dark fw-bold stretched-link">
                        {item.name}
                      </Link>
                      <div className="text-muted small mt-1">
                        Quantity: {item.quantity}
                      </div>
                      <div className="text-muted small">
                        Price per item: ₹{item.price.toFixed(2)}
                      </div>
                      <div className="fw-bold mt-1">
                        Subtotal: ₹{(item.quantity * item.price).toFixed(2)}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Right Column: Shipping and Payment Details */}
        <Col lg={4}>
          <Card className="shadow-sm mb-4 sticky-top" style={{ top: '2rem' }}>
            <Card.Header as="h5">Shipping Address</Card.Header>
            <Card.Body>
              <div className="mb-2"><FaUser className="me-2 text-muted" /> {order.shippingAddress.name}</div>
              <div className="mb-2"><FaPhone className="me-2 text-muted" /> {order.shippingAddress.phone}</div>
              <address className="mb-0 text-muted small">
                {order.shippingAddress.address}, <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </address>
              <Alert variant={order.isDelivered ? "success" : "warning"} className="mt-3 small py-2">
                Delivery Status: {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : "In Process"}
              </Alert>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4 sticky-top" style={{ top: 'calc(2rem + height_of_first_card + 1rem)' }}>
            <Card.Header as="h5">Payment Details</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between px-3 py-2 small">
                <span>Items Price:</span>
                <span>₹{order.itemsPrice.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between px-3 py-2 small text-muted">
                <span>Shipping:</span>
                <span>₹{order.shippingPrice.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between px-3 py-2 small text-muted">
                <span>Tax:</span>
                <span>₹{order.taxPrice.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between px-3 py-2 fw-bold h6 mb-0">
                <span>Total Paid:</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="px-3 py-2">
                <div className="d-flex justify-content-between align-items-center mb-1 small">
                  <span>Payment Status:</span>
                  {order.isPaid ? (
                    <Badge bg="success" pill>Paid</Badge>
                  ) : (
                    <Badge bg="danger" pill>Pending</Badge>
                  )}
                </div>
                {order.isPaid && order.paymentResult?.id && (
                  <div className="text-muted small mt-2">
                    <strong>Transaction ID:</strong> {order.paymentResult.id}
                  </div>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} lg={2} className="desktop-sidebar bg-light vh-100 p-0 shadow-sm sticky-top">
          <AdminSidebar />
        </Col>
        <Col md={10} lg={10} className="main-content-area py-4 px-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4 page-title-animation">
            <h2 className="fw-bold">Order Details</h2>
            <Button variant="outline-secondary" size="sm" onClick={() => navigate('/orders')}>
                <FaArrowLeft className="me-1" /> Back to Orders
            </Button>
          </div>
          {renderContent()}
        </Col>
      </Row>
      <AdminBottomNavbar />
    </Container>
  );
}