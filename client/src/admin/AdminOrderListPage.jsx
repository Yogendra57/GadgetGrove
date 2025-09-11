// src/pages/admin/AdminOrderListPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from './AdminSidebar';
import { FaEye, FaCheck } from 'react-icons/fa';
import "../stylesheets/ResponsiveNavbar.css";
import "./stylesheets/AdminPage.css"; // Reusing admin styles
import AdminBottomNavbar from './AdminBottomNavbar';
import { toast } from 'react-toastify';

// Skeleton Loader for table rows
const SkeletonRow = () => (
  <tr>
    <td><div className="skeleton-line w-75"></div></td>
    <td><div className="skeleton-line w-100"></div></td>
    <td><div className="skeleton-line w-50"></div></td>
    <td><div className="skeleton-line w-100"></div></td>
    <td><div className="skeleton-line w-100"></div></td>
    <td><div className="skeleton-line w-75"></div></td>
  </tr>
);

export default function AdminOrderListPage() {
  const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data.orders);
    } catch (err) {
      toast.error("Failed to fetch orders.");
      setError('Failed to fetch orders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const markAsDeliveredHandler = async (orderId) => {
    try {
        await api.put(`/orders/${orderId}/deliver`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update the state locally for an instant UI change
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === orderId ? { ...order, isDelivered: true } : order
            )
        );
        toast.success("Order marked as delivered.");
        
    } catch (err) {
        console.error("Failed to mark as delivered:", err);
        toast.error("Failed to update order status.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="desktop-sidebar bg-dark text-white p-0">
          <AdminSidebar />
        </Col>

        <Col md={10} className="main-content-area py-4 px-md-5">
          <div className="page-title-animation mb-4">
            <h2 className="fw-bold">Order Management</h2>
            <p className="text-muted">View and manage all customer orders.</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="table-responsive-wrapper shadow-sm rounded">
            <Table responsive hover className="admin-orders-table align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="table-row-animation">
                      <td>{order._id.substring(order._id.length - 6)}</td>
                      <td>{order.user?.name || 'Guest User'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? (
                          <Badge pill bg="success">Paid</Badge>
                        ) : (
                          <Badge pill bg="warning" text="dark">Pending</Badge>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <Badge pill bg="info">Delivered</Badge>
                        ) : (
                          <Badge pill bg="secondary">Processing</Badge>
                        )}
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2 action-btn" title="View Details" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                          <FaEye />
                        </Button>
                        {!order.isDelivered && (
                            <Button variant="outline-success" size="sm" className="action-btn" title="Mark as Delivered" onClick={() => markAsDeliveredHandler(order._id)}>
                                <FaCheck />
                            </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <AdminBottomNavbar />
    </Container>
  );
}