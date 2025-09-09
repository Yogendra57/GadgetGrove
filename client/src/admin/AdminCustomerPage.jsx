// src/pages/admin/AdminCustomerPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import api from '../utils/api';
import AdminSidebar from './AdminSideBar';
import BottomNavbar from '/Users/yug/Desktop/ecommerce/client/src/components/BottomNavbar.jsx'; // Reusing existing components
import { FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
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
    <td><div className="skeleton-line w-75"></div></td>
  </tr>
);

export default function AdminCustomerPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data.users);
    } catch (err) {
      toast.error("Failed to fetch users.");
      setError('Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserHandler = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user._id !== userId));
        toast.success('User deleted successfully.');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user.');
      }
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
            <h2 className="fw-bold">Customer Management</h2>
            <p className="text-muted">View and manage registered users.</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="table-responsive-wrapper shadow-sm rounded">
            <Table responsive hover className="admin-users-table align-middle">
              <thead className="table-light">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                  <th>Role</th>
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
                  users.map((user) => (
                    <tr key={user._id} className="table-row-animation">
                      <td>{user._id.substring(user._id.length - 6)}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.isAdmin ? (
                          <Badge pill bg="success"><FaUserShield className="me-1" /> Admin</Badge>
                        ) : (
                          <Badge pill bg="secondary"><FaUser className="me-1" /> Customer</Badge>
                        )}
                      </td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="action-btn" 
                          title="Delete User"
                          onClick={() => deleteUserHandler(user._id)}
                          disabled={user.isAdmin} // Prevent deleting other admins via UI
                        >
                          <FaTrash />
                        </Button>
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