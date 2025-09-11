
// src/components/ProductList.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert, Form, InputGroup, Button, Offcanvas } from "react-bootstrap";
import api from "../utils/api";
import Card from "./Card";
import LeftSidebar from "./LeftSidebar";
import BottomNavbar from "./BottomNavbar";
import "../stylesheets/ResponsiveNavbar.css";
import "../stylesheets/ProductListPage.css"; 
import { FaSearch, FaFilter, FaStar, FaSortAmountDown } from "react-icons/fa";
import { toast } from "react-toastify";

// --- Debounce Hook (for efficient searching) ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ProductList = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilterCanvas, setShowFilterCanvas] = useState(false); 

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
        if (ratingFilter > 0) params.append("rating", ratingFilter);
        if (sortOption) params.append("sort", sortOption);

        const res = await api.get(`/products?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
        setError(error.message || "Failed to fetch products.");
        toast.error(error.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    } else {
      setError("You are not authenticated");
      toast.error("You are not authenticated. Please log in.");
      setLoading(false);
    }
  }, [token, debouncedSearchTerm, ratingFilter, sortOption]);

  const FilterUI = () => (
    <>
      <Form.Group as={Col} md={4} sm={6} className="filter-group mb-3 mb-md-0">
        <Form.Label className="filter-label"><FaStar className="me-1" /> Filter by Rating</Form.Label>
        <Form.Select value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))}>
          <option value="0">All Ratings</option>
          <option value="4">4 Stars & Up</option>
          <option value="3">3 Stars & Up</option>
          <option value="2">2 Stars & Up</option>
          <option value="1">1 Star & Up</option>
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} md={4} sm={6} className="filter-group mb-3 mb-md-0">
        <Form.Label className="filter-label"><FaSortAmountDown className="me-1" /> Sort By</Form.Label>
        <Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
        </Form.Select>
      </Form.Group>
    </>
  );

  return (
    <Container fluid>
      <Row>
        {/* --- Sidebar Column --- */}
        <Col md={2} lg={2} className="desktop-sidebar bg-light vh-100 p-0 shadow-sm sticky-top">
          <LeftSidebar />
        </Col>

        {/* --- Product Content Column --- */}
        <Col md={10} lg={10} className="main-content-area">
          <div className="container-fluid p-4 product-grid-container">
            <h2 className="mb-4 fw-bold page-title-animation">Products</h2>

            {/* --- NEW: Redesigned Filter Bar --- */}
            <div className="filter-bar-v2 mb-4">
              <Row className="gy-3 align-items-end">
                {/* Search Bar */}
                <Col md={12} lg={8} xl={8}>
                  <Form.Group className="search-bar-wrapper position-relative">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      className="search-input ps-5"
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                
                {/* Desktop Filters */}
                <Row as={Col} md={12} lg={4} xl={4} className="d-none d-lg-flex desktop-filters gy-3">
                  <FilterUI />
                </Row>

                {/* Mobile Filter Button */}
                <Col xs={12} className="d-lg-none text-end">
                  <Button variant="outline-secondary" onClick={() => setShowFilterCanvas(true)}>
                    <FaFilter className="me-2" /> Filters & Sort
                  </Button>
                </Col>
              </Row>
            </div>

            {/* --- Product Grid --- */}
            {loading ? (
              <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <Row>
                {products.length > 0 ? products.map((item) => (
                  <Col key={item._id} sm={6} lg={4} className="mb-4 d-flex align-items-stretch card-fade-in">
                    <Card
                      _id={item._id}
                      image={item.image}
                      title={item.name}
                      brand={item.brand}
                      text={item.description}
                      category={item.category}
                      price={item.price}
                      rating={item.rating}
                      link={`/products/${item._id}`}
                      fromcomp="product"
                      countInStock={item.countInStock}
                    />
                  </Col>
                )) : <Alert variant="info">No products match your criteria.</Alert>}
              </Row>
            )}
          </div>
        </Col>
      </Row>

      {/* --- Mobile Off-canvas Filter Menu --- */}
      <Offcanvas show={showFilterCanvas} onHide={() => setShowFilterCanvas(false)} placement="bottom" className="d-lg-none filter-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters & Sort</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <FilterUI />
          </Row>
        </Offcanvas.Body>
      </Offcanvas>

      <BottomNavbar />
    </Container>
  );
};

export default ProductList;







