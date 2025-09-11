
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Image,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "./AdminSidebar";
import AdminBottomNavbar from "./AdminBottomNavbar";
import {
  FaUser,
  FaPhone,
  FaCreditCard,
  FaArrowLeft,
  FaFilePdf,
  FaCheck,
} from "react-icons/fa";
import "../stylesheets/OrderDetailsPage.css";
import "../stylesheets/ResponsiveNavbar.css";
import { toast } from "react-toastify";

// --- Skeleton Loader Component ---
const OrderDetailsSkeleton = () => {
  <Row>
    <Col lg={8}>
      <Card className="mb-3 skeleton-card">
        <Card.Header style={{ height: "50px" }}></Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item style={{ height: "70px" }}></ListGroup.Item>
          <ListGroup.Item style={{ height: "70px" }}></ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
    <Col lg={4}>
      <Card className="mb-3 skeleton-card">
        <Card.Header style={{ height: "50px" }}></Card.Header>
        <Card.Body style={{ height: "150px" }}></Card.Body>
      </Card>
    </Col>
  </Row>;
};

// --- Main Page Component ---
export default function AdminOrderDetailPage() {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
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
        setError("Failed to fetch order details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId && token) {
      fetchOrderDetails();
    } else {
      setError("No order ID provided or user not authenticated.");
      setLoading(false);
    }
  }, [orderId, token]);

  // --- Admin Action: Mark as Delivered ---
  const handleMarkAsDelivered = async () => {
    if (
      window.confirm("Are you sure you want to mark this order as delivered?")
    ) {
      try {
        const { data } = await api.put(
          `/orders/${orderId}/deliver`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(data.order); // Update the state with the returned updated order
        toast.success("Order marked as delivered!");
      } catch (err) {
        toast.error("Failed to update order status.");
      }
    }
  };
  const handleDownloadInvoice = async () => {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important: tells Axios to expect a file blob
      });

      // Create a URL from the file blob
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`); // Set the filename for the download
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download invoice:", error);
      toast.error("Failed to download invoice.");
    }
  };

  const renderContent = () => {
    if (loading) return <OrderDetailsSkeleton />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!order) return <Alert variant="warning">Order not found.</Alert>;

    return (
      <Row className="gy-4 form-step-animation">
        {/* Left Column: Order Items */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header as="h5">
              Order Items ({order.orderItems.length})
            </Card.Header>
            <ListGroup variant="flush">
              {order.orderItems.map((item) => (
                <ListGroup.Item key={item.product} className="py-3 px-3">
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <Image
                        src={`${BACKEND_URL}/${item.image}`}
                        alt={item.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col xs={9} md={10}>
                      <Link
                        to={`/products/${item.product}`}
                        className="text-decoration-none text-dark fw-bold stretched-link"
                      >
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

        {/* Right Column: Combined Summary Card */}
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: "2rem" }}>
            <Card.Header as="h5">Order Summary</Card.Header>
            <Card.Body>
              <h6 className="fw-bold">Shipping Address</h6>
              <div className="mb-2 small">
                <FaUser className="me-2 text-muted" />{" "}
                {order.shippingAddress.name}
              </div>
              <div className="mb-2 small">
                <FaPhone className="me-2 text-muted" />{" "}
                {order.shippingAddress.phone}
              </div>
              <address className="mb-3 text-muted small">
                {order.shippingAddress.address}, <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </address>

              <hr />

              <h6 className="fw-bold mt-3">Payment Details</h6>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between px-0 py-1 small">
                  <span>Items Price:</span>
                  <span>₹{order.itemsPrice.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0 py-1 small text-muted">
                  <span>Shipping & Tax:</span>
                  <span>
                    ₹{(order.shippingPrice + order.taxPrice).toFixed(2)}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0 py-2 fw-bold h6 mb-0">
                  <span>Total Paid:</span>
                  <span>₹{order.totalPrice.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="small">Payment Status:</span>
                {order.isPaid ? (
                  <Badge bg="success">Paid</Badge>
                ) : (
                  <Badge bg="danger">Pending</Badge>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small">Delivery Status:</span>
                {order.isDelivered ? (
                  <Badge bg="success">Delivered</Badge>
                ) : (
                  <Badge bg="warning" text="dark">
                    Processing
                  </Badge>
                )}
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 pt-0">
              <div className="d-grid gap-2">
                {!order.isDelivered && (
                  <Button variant="success" onClick={handleMarkAsDelivered}>
                    <FaCheck className="me-2" /> Mark as Delivered
                  </Button>
                )}
                <Button
                  variant="outline-secondary"
                  onClick={handleDownloadInvoice} // Use the new handler
                >
                  <FaFilePdf className="me-2" /> Download Invoice
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid>
      <Row>
        {/* Use Admin specific components */}
        <Col
          md={2}
          lg={2}
          className="desktop-sidebar bg-dark vh-100 p-0 shadow-sm sticky-top"
        >
          <AdminSidebar />
        </Col>
        <Col md={10} lg={10} className="main-content-area py-4 px-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4 page-title-animation">
            <h2 className="fw-bold">Order Details</h2>
            {/* Correct navigation path for admin */}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate("/admin/orders")}
            >
              <FaArrowLeft className="me-1" /> Back to All Orders
            </Button>
          </div>
          {renderContent()}
        </Col>
      </Row>
      <AdminBottomNavbar />
    </Container>
  );
}
