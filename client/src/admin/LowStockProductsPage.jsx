// src/pages/admin/LowStockProductsPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Spinner, Alert, Button, Badge, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from './AdminSidebar';
import AdminBottomNavbar from './AdminBottomNavbar';
import { FaEdit, FaExclamationTriangle } from 'react-icons/fa';

import "./stylesheets/AdminPage.css";

export default function LowStockProductsPage() {
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const { data } = await api.get('/products/low-stock', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(data.products);
      } catch (err) {
        setError('Failed to fetch low stock products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if(token) fetchLowStock();
  }, [token]);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="desktop-sidebar bg-dark text-white p-0">
          <AdminSidebar />
        </Col>

        <Col md={10} className="main-content-area py-4 px-md-5">
          <div className="page-title-animation mb-4">
            <h2 className="fw-bold d-flex align-items-center"><FaExclamationTriangle className="me-3 text-danger"/> Low Stock Items</h2>
            <p className="text-muted">Products with 10 or fewer items in stock.</p>
          </div>

          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="table-responsive-wrapper shadow-sm rounded">
              <Table responsive hover className="admin-product-table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Stock Remaining</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="table-row-animation">
                      <td>
                        <Image src={`${BACKEND_URL}/${product.image[0]}`} thumbnail className="product-table-image" />
                      </td>
                      <td className="fw-medium">{product.name}</td>
                      <td className="fw-bold">{product.countInStock}</td>
                      <td>
                        {product.countInStock === 0 ? (
                          <Badge bg="danger">Out of Stock</Badge>
                        ) : (
                          <Badge bg="warning" text="dark">Low Stock</Badge>
                        )}
                      </td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                          <FaEdit className="me-1" /> Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
      <AdminBottomNavbar />
    </Container>
  );
};