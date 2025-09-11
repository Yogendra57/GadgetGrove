// src/pages/admin/AdminProductListPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminSidebar from "./AdminSidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../stylesheets/ResponsiveNavbar.css"; // Responsive layout styles
import "./stylesheets/AdminPage.css"; // Custom admin styles
import AdminBottomNavbar from "./AdminBottomNavbar";
import { toast } from "react-toastify";

const AdminProductListPage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Ensure token is retrieved for API calls
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetches all products. No token needed if route is public, add header if protected.
      const res = await api.get("/products",{
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data.products);
    } catch (err) {
      toast.error("Failed to fetch products.");
      setError("Failed to fetch products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Admin actions must be protected
        });
        toast.success("Product deleted successfully.");
        setProducts(products.filter((p) => p._id !== productId));
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleCreateProduct = () => {
    navigate("/admin/add-product");
  };

  const renderProductTable = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    return (
      <div className="table-responsive-wrapper shadow-sm rounded">
        <Table responsive hover className="admin-product-table align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="table-row-animation"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  {/* Assuming image[0] exists and path construction is correct */}
                  <Image
                    src={`${BACKEND_URL}/${product.image[0]}`}
                    thumbnail
                    className="product-table-image"
                  />
                </td>
                <td className="fw-medium">{product.name}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>
                  {product.countInStock > 0 ? (
                    product.countInStock
                  ) : (
                    <span className="badge bg-danger">Out of Stock</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2 action-btn"
                    onClick={() =>
                      navigate(`/admin/product/${product._id}/edit`)
                    }
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="action-btn"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="desktop-sidebar bg-dark text-white p-0">
          <AdminSidebar />
        </Col>

        <Col md={10} className="main-content-area py-4 px-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4 page-title-animation">
            <h2 className="fw-bold">Product Management</h2>
            <Button variant="primary" onClick={handleCreateProduct}>
              <FaPlus className="me-2" /> Add New Product
            </Button>
          </div>
          {renderProductTable()}
        </Col>
      </Row>
      <AdminBottomNavbar />
    </Container>
  );
};

export default AdminProductListPage;
