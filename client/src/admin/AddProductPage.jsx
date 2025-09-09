// src/pages/admin/AddProductPage.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Image, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from './AdminSideBar';
import BottomNavbar from '/Users/yug/Desktop/ecommerce/client/src/components/BottomNavbar.jsx'; // Assuming shared responsive layout
import "../stylesheets/ResponsiveNavbar.css"; // Reusing responsive styles
import "./stylesheets/AdminPage.css"; // Reusing admin styles
import AdminBottomNavbar from './AdminBottomNavbar';
import { toast } from 'react-toastify';

export default function AddProductPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State for form fields based on schema
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    countInStock: "",
    keyFeatures: "", // Will be split by comma later
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Create FormData object
    const dataToUpload = new FormData();
    dataToUpload.append("name", formData.name);
    dataToUpload.append("description", formData.description);
    dataToUpload.append("price", formData.price);
    dataToUpload.append("category", formData.category);
    dataToUpload.append("brand", formData.brand);
    dataToUpload.append("countInStock", formData.countInStock);
    
    // Convert comma-separated string to array for keyFeatures
    formData.keyFeatures.split(',').forEach(feature => {
        dataToUpload.append("keyFeatures[]", feature.trim());
    });

    // Append images
    for (let i = 0; i < imageFiles.length; i++) {
      dataToUpload.append("images", imageFiles[i]);
    }

    try {
      await api.post('/products', dataToUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to create product.');
      setError(err.response?.data?.message || 'Failed to create product.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="desktop-sidebar bg-dark text-white p-0">
          <AdminSidebar />
        </Col>

        <Col md={10} className="main-content-area py-4 px-md-5">
          <h2 className="mb-4 fw-bold page-title-animation">Add New Product</h2>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    {/* Product Name */}
                    <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                      <Form.Control type="text" name="name" placeholder="Enter product name" onChange={handleChange} required />
                    </FloatingLabel>

                    {/* Description */}
                    <FloatingLabel controlId="description" label="Description" className="mb-3">
                      <Form.Control as="textarea" name="description" style={{ height: '150px' }} placeholder="Product description" onChange={handleChange} required />
                    </FloatingLabel>

                    {/* Key Features */}
                    <FloatingLabel controlId="keyFeatures" label="Key Features (comma-separated)" className="mb-3">
                      <Form.Control type="text" name="keyFeatures" placeholder="Feature 1, Feature 2, Feature 3" onChange={handleChange} required />
                    </FloatingLabel>
                  </Col>
                  <Col md={4}>
                    {/* Price */}
                    <FloatingLabel controlId="price" label="Price (₹)" className="mb-3">
                      <Form.Control type="number" name="price" placeholder="Enter price" onChange={handleChange} required />
                    </FloatingLabel>

                    {/* Stock Count */}
                    <FloatingLabel controlId="countInStock" label="Count In Stock" className="mb-3">
                      <Form.Control type="number" name="countInStock" placeholder="Enter stock quantity" onChange={handleChange} required />
                    </FloatingLabel>

                    {/* Category */}
                    <FloatingLabel controlId="category" label="Category" className="mb-3">
                      <Form.Control type="text" name="category" placeholder="e.g., Electronics" onChange={handleChange} required />
                    </FloatingLabel>

                    {/* Brand */}
                    <FloatingLabel controlId="brand" label="Brand" className="mb-3">
                      <Form.Control type="text" name="brand" placeholder="e.g., Sony, Apple" onChange={handleChange} required />
                    </FloatingLabel>
                  </Col>
                </Row>
                
                <hr className="my-4" />

                {/* Image Upload Section */}
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="images" className="mb-3">
                      <Form.Label className="fw-bold">Product Images</Form.Label>
                      <Form.Control type="file" multiple onChange={handleImageChange} required accept="image/*" />
                      <Form.Text className="text-muted">Upload one or more images for the product gallery.</Form.Text>
                    </Form.Group>
                    
                    {/* Image Previews */}
                    <div className="d-flex flex-wrap mt-3 image-preview-container">
                      {imagePreviews.map((previewSrc, index) => (
                        <Image key={index} src={previewSrc} thumbnail className="me-2 mb-2 image-preview" />
                      ))}
                    </div>
                  </Col>
                </Row>

                <div className="text-end mt-4">
                  <Button variant="secondary" type="button" className="me-2" onClick={() => navigate('/admin/products')}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Save Product"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AdminBottomNavbar />
    </Container>
  );
}