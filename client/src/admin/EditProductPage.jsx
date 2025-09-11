// src/pages/admin/EditProductPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Image, FloatingLabel } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from './AdminSidebar';
import "../stylesheets/ResponsiveNavbar.css";
import "./stylesheets/AdminPage.css"; // Reusing admin styles
import AdminBottomNavbar from './AdminBottomNavbar';
import { toast } from 'react-toastify';

export default function EditProductPage() {
  const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate();
  const { id: productId } = useParams(); // Get product ID from URL parameter
  const token = localStorage.getItem("token");

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    countInStock: "",
    keyFeatures: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch existing product data ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`,{
          headers: { Authorization: `Bearer ${token}` }
        });
        const product = data.product;
        // Pre-fill form state with existing data
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          countInStock: product.countInStock,
          keyFeatures: product.keyFeatures.join(', '), // Convert array back to comma-separated string for input field
        });
        setExistingImageUrls(product.image || []);
      } catch (err) {
        toast.error("Failed to fetch product details.");
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create image previews for new images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // --- Form Submission Handler for Updates ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToUpload = new FormData();
    dataToUpload.append("name", formData.name);
    dataToUpload.append("description", formData.description);
    dataToUpload.append("price", formData.price);
    dataToUpload.append("category", formData.category);
    dataToUpload.append("brand", formData.brand);
    dataToUpload.append("countInStock", formData.countInStock);
    formData.keyFeatures.split(',').forEach(feature => {
        dataToUpload.append("keyFeatures[]", feature.trim());
    });

    // Only append new images if the user selected some.
    // Backend logic should handle keeping old images if req.files is empty.
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        dataToUpload.append("images", imageFiles[i]);
      }
    }

    try {
      await api.put(`/products/${productId}`, dataToUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
      console.error(err);
      toast.error("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <Container fluid><Row><Col md={2} className="desktop-sidebar bg-dark p-0"><AdminSidebar /></Col><Col md={10} className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}><Spinner animation="border" /></Col></Row></Container>;
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="desktop-sidebar bg-dark text-white p-0">
          <AdminSidebar />
        </Col>

        <Col md={10} className="main-content-area py-4 px-md-5">
          <h2 className="mb-4 fw-bold page-title-animation">Edit Product</h2>
          <Card className="shadow-sm border-0 form-load-animation">
            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="description" label="Description" className="mb-3">
                      <Form.Control as="textarea" name="description" value={formData.description} style={{ height: '150px' }} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="keyFeatures" label="Key Features (comma-separated)" className="mb-3">
                      <Form.Control type="text" name="keyFeatures" value={formData.keyFeatures} onChange={handleChange} required />
                    </FloatingLabel>
                  </Col>
                  <Col md={4}>
                    <FloatingLabel controlId="price" label="Price (₹)" className="mb-3">
                      <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="countInStock" label="Count In Stock" className="mb-3">
                      <Form.Control type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="category" label="Category" className="mb-3">
                      <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="brand" label="Brand" className="mb-3">
                      <Form.Control type="text" name="brand" value={formData.brand} onChange={handleChange} required />
                    </FloatingLabel>
                  </Col>
                </Row>
                
                <hr className="my-4" />

                {/* Image Upload Section */}
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="images" className="mb-3">
                      <Form.Label className="fw-bold">Upload New Images</Form.Label>
                      <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
                      <Form.Text className="text-muted">Uploading new images will replace all existing images for this product.</Form.Text>
                    </Form.Group>
                    
                    {/* Image Previews */}
                    <h6 className="small fw-bold mt-4">Current Images:</h6>
                    <div className="d-flex flex-wrap image-preview-container mb-3">
                      {imagePreviews.length === 0 && existingImageUrls.map((url, index) => (
                        <Image key={index} src={`${BACKEND_URL}/${url}`} thumbnail className="me-2 mb-2 image-preview" />
                      ))}
                      {imagePreviews.map((previewSrc, index) => (
                        <Image key={index} src={previewSrc} thumbnail className="me-2 mb-2 image-preview new-image-preview" />
                      ))}
                    </div>
                  </Col>
                </Row>

                <div className="text-end mt-4">
                  <Button variant="secondary" type="button" className="me-2" onClick={() => navigate('/admin/products')}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Update Product"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AdminBottomNavbar/>
    </Container>
  );
}