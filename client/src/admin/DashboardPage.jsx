
// src/pages/admin/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from './AdminSideBar';
import AdminBottomNavbar from './AdminBottomNavbar';
import { FaDollarSign, FaShoppingCart, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import "../stylesheets/ResponsiveNavbar.css"; 
import "./stylesheets/AdminPage.css"; 
import { toast } from 'react-toastify';

// --- Stat Card Component ---
const StatCard = ({ title, value, icon, colorVariant, animationDelay }) => (
    <Card className={`stat-card shadow border-start border-${colorVariant} border-4 animate__animated animate__fadeInUp`} style={{ animationDelay }}>
        <Card.Body>
            <Row className="align-items-center">
                <Col xs={3}>
                    <div className={`icon-circle bg-light-${colorVariant} text-${colorVariant}`}>
                        {icon}
                    </div>
                </Col>
                <Col xs={9}>
                    <div className="text-xs fw-bold text-uppercase mb-1 text-muted">{title}</div>
                    <div className="h5 mb-0 fw-bold text-dark">{value}</div>
                </Col>
            </Row>
        </Card.Body>
    </Card>
);

// --- Skeleton Loader Components ---
const SkeletonStatCard = () => (
    <Card className="stat-card shadow border-start border-light border-4 skeleton-wrapper">
        <Card.Body>
            <Row className="align-items-center">
                <Col xs={3}>
                    <div className="skeleton-circle"></div>
                </Col>
                <Col xs={9}>
                    <div className="skeleton-line w-75 mb-2"></div>
                    <div className="skeleton-line w-50"></div>
                </Col>
            </Row>
        </Card.Body>
    </Card>
);

const SkeletonTableRow = () => (
    <tr>
        <td><div className="skeleton-line w-75"></div></td>
        <td><div className="skeleton-line w-100"></div></td>
        <td><div className="skeleton-line w-50"></div></td>
        <td><div className="skeleton-line w-100"></div></td>
        <td><div className="skeleton-line w-75"></div></td>
    </tr>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (err) {
        toast.error("Failed to load dashboard statistics.");
        setError("Failed to load dashboard statistics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    // Simulate loading for better visual effect on fast connections
    setTimeout(fetchStats, 1000); 
  }, [token]);

  return (
    <Container fluid>
      <Row>
        {/* --- Sidebar Column --- */}
        <Col md={2} className="desktop-sidebar bg-dark text-white p-0">
          <AdminSidebar />
        </Col>

        {/* --- Dashboard Content Column --- */}
        <Col md={10} className="main-content-area py-4 px-md-5 bg-light">
          <h2 className="mb-4 fw-bold page-title-animation">Admin Dashboard</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          {/* --- Statistics Cards --- */}
          <Row className="mb-4">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <Col xl={3} md={6} className="mb-4" key={i}>
                  <SkeletonStatCard />
                </Col>
              ))
            ) : (
              <>
                <Col xl={3} md={6} className="mb-4">
                  <StatCard 
                    title="Total Revenue" 
                    value={stats ? `₹${stats.totalRevenue.toFixed(2)}` : 'N/A'}
                    icon={<FaDollarSign size={24} />} 
                    colorVariant="success"
                    animationDelay="0s"
                  />
                </Col>
                <Col xl={3} md={6} className="mb-4">
                  <StatCard 
                    title="Total Orders" 
                    value={stats ? stats.totalOrders : 'N/A'}
                    icon={<FaShoppingCart size={24} />} 
                    colorVariant="primary"
                    animationDelay="0.1s"
                  />
                </Col>
                <Col xl={3} md={6} className="mb-4">
                  <StatCard 
                    title="Total Customers" 
                    value={stats ? stats.totalUsers : 'N/A'}
                    icon={<FaUsers size={24} />} 
                    colorVariant="info"
                    animationDelay="0.2s"
                  />
                </Col>
                <Col xl={3} md={6} className="mb-4">
                  <StatCard 
                    title="Low Stock Items" 
                    value={stats ? stats.lowStockCount : 'N/A'}
                    icon={<FaExclamationTriangle size={24} />} 
                    colorVariant="danger"
                    animationDelay="0.3s"
                  />
                </Col>
              </>
            )}
          </Row>

          {/* --- Recent Orders Table --- */}
          <Row>
            <Col>
              <Card className="shadow-sm border-0 animate__animated animate__fadeInUp" style={{ animationDelay: loading ? '0s' : '0.4s' }}>
                <Card.Header as="h5" className="bg-white border-bottom-0 pt-3 pb-0">Recent Orders</Card.Header>
                <Card.Body>
                  <Table responsive hover className="recent-orders-table align-middle">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <>
                          <SkeletonTableRow />
                          <SkeletonTableRow />
                          <SkeletonTableRow />
                        </>
                      ) : (
                        stats?.recentOrders.map(order => (
                          <tr key={order._id}>
                            <td><Link to={`/admin/order/${order._id}`}>{order._id.substring(0, 8)}...</Link></td>
                            <td>{order.user?.name || 'Guest User'}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>₹{order.totalPrice.toFixed(2)}</td>
                            <td>
                              <Badge bg={order.isDelivered ? "success" : "warning"} text={order.isDelivered ? "" : "dark"}>
                                {order.isDelivered ? "Delivered" : "Processing"}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <AdminBottomNavbar />
    </Container>
  );
}