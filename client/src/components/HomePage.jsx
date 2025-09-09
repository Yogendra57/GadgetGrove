// src/pages/HomePage.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Carousel,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaUserPlus,
  FaTruck,
  FaShieldAlt,
  FaComments,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import "../stylesheets/HomePage.css"; // New CSS file for Home Page styling
import api from "../utils/api"; // Your API utility
import { toast } from "react-toastify";

// --- Static Data for Services Section ---
const services = [
  {
    icon: FaTruck,
    title: "Fast Delivery",
    description: "Receive your orders quickly and securely.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Payments",
    description: "Shop with confidence, knowing your data is safe.",
  },
  {
    icon: FaComments,
    title: "24/7 Support",
    description: "Our team is always here to assist you.",
  },
  {
    icon: FaUserPlus,
    title: "Exclusive Deals",
    description: "Get access to member-only discounts.",
  },
];

const HomePage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // --- State for Fetched Products ---
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetches products from your backend route
        const res = await api.get("/products/featured-products");
        setFeaturedProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        toast.error("Failed to fetch featured products.");
        setError("Could not load featured products at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Calculate number of slides based on fetched data length
  const numSlides = useMemo(
    () => Math.ceil(featuredProducts.length / 3),
    [featuredProducts]
  );

  // Auto-rotate carousel logic
  useEffect(() => {
    if (numSlides > 1) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % numSlides);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [numSlides]);

  // --- Add to Cart Handler (Example) ---
  const handleAddToCart = (productId) => {
    console.log(`Add product ${productId} to cart`);
    // Add real cart logic here
  };

  // --- Star Rating Display Helper ---
  const StarRatingDisplay = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} color={i <= rating ? "#ffc107" : "#e4e5e9"} />
      );
    }
    return <div>{stars}</div>;
  };

  // --- Render Function for Carousel Content ---
  const renderProductCarousel = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }
    if (error) {
      return <Alert variant="warning">{error}</Alert>;
    }
    if (!featuredProducts || featuredProducts.length === 0) {
      return <Alert variant="info">No featured products found.</Alert>;
    }

    return (
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        indicators={false}
        controls={true}
        interval={null}
        className="custom-product-carousel"
      >
        {[...Array(numSlides)].map((_, carouselIndex) => (
          <Carousel.Item key={carouselIndex}>
            <Row className="justify-content-center">
              {featuredProducts
                .slice(carouselIndex * 3, carouselIndex * 3 + 3)
                .map((product) => (
                  <Col
                    md={4}
                    sm={6}
                    xs={12}
                    key={product._id}
                    className="mb-4 d-flex align-items-stretch"
                  >
                    <Card className="product-card">
                      <Card.Img
                        variant="top"
                        src={`${BACKEND_URL}/${product.image[0]}`}
                        alt={product.name}
                        onClick={() => navigate(`/products/${product._id}`)}
                        style={{ cursor: "pointer" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title
                          as="h6"
                          className="fw-bold text-truncate"
                          title={product.name}
                        >
                          {product.name}
                        </Card.Title>
                        <Card.Text className="text-muted flex-grow-1 limited-text-description">
                          {product.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex">
                            <StarRatingDisplay rating={product.rating} />
                            <span>{product.rating}/5</span>
                          </div>
                          <span className="fw-bold fs-5 text-primary">
                            &#x20B9;{product.price.toFixed(2)}
                          </span>
                        </div>
                        <Button
                          variant="success"
                          className="w-100 add-to-cart-btn"
                          onClick={() => handleAddToCart(product._id)}
                        >
                          <FaShoppingCart className="me-2" /> Add to Cart
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };

  return (
    <div className="home-page-wrapper">
      {/* --- 1. Hero Section --- */}
      <section className="hero-section text-white d-flex align-items-center justify-content-center text-center">
        <div className="hero-background">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/homepagevedio2.mp4"
          ></video>
        </div>
        <div className="hero-content animated-fade-in-up">
          <h1 className="display-3 fw-bold mb-3">Welcome to GadgetGrove!</h1>
          <p className="lead mb-4">
            Your one-stop shop for the latest and greatest tech gadgets.
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg" className="hero-cta-btn">
              Explore Our Products
            </Button>
          </Link>
        </div>
      </section>

      {/* --- 2. Product Carousel --- */}
      <section className="product-carousel-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold section-title animate-on-scroll">
            Featured Products
          </h2>
          {renderProductCarousel()}
        </Container>
      </section>

      {/* --- 3. Account Benefits & CTA --- */}
      <section className="account-benefits-section py-5 text-white text-center">
        <Container>
          <h2 className="mb-4 fw-bold section-title animate-on-scroll">
            Unlock More with an Account
          </h2>
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <p className="lead">
                Create your free account today for a personalized shopping
                experience, faster checkout, order tracking, and exclusive
                member-only offers!
              </p>
            </Col>
          </Row>
          <Link to="/signup">
            <Button
              variant="info"
              size="lg"
              className="signup-cta-btn animate-bounce-on-hover"
            >
              <FaUserPlus className="me-2" /> Sign Up Now!
            </Button>
          </Link>
        </Container>
      </section>

      {/* --- 4. Services/Features Section --- */}
      <section className="services-section py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5 fw-bold section-title animate-on-scroll">
            Why Choose Us?
          </h2>
          <Row className="justify-content-center">
            {services.map((service, idx) => (
              <Col lg={3} md={6} sm={12} key={idx} className="mb-4">
                <Card className="service-card text-center animate-service-card">
                  <Card.Body>
                    <service.icon
                      size={50}
                      className="text-primary mb-3 service-icon-animate"
                    />
                    <Card.Title className="fw-bold">{service.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {service.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* --- 5. About Us Section --- */}
      <section className="about-us-section py-5 text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
              <img
                src="/aboutimage3.jpg"
                alt="About Us"
                className="img-fluid rounded shadow-lg animate-on-scroll"
              />
            </Col>
            <Col md={6} className="text-center text-md-start">
              <h2 className="mb-4 fw-bold section-title animate-on-scroll">
                About GadgetGrove
              </h2>
              <p className="lead">
                At GadgetGrove, we believe in bringing the future to your
                fingertips. Founded on a passion for innovation and quality, we
                handpick the most exciting and reliable tech gadgets from around
                the globe. Our mission is to provide a seamless shopping
                experience, ensuring you always find the perfect device to
                enhance your digital life.
              </p>
              <Link to="/about">
                <Button
                  variant="outline-light"
                  className="mt-3 learn-more-btn animate-on-hover-grow"
                >
                  Learn More
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- 6. Footer --- */}
      <footer className="bg-dark text-white-50 py-4">
        <Container>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <h5 className="text-white">GadgetGrove</h5>
              <p>Your ultimate destination for cutting-edge electronics.</p>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <h5 className="text-white">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link
                    to="/products"
                    className="text-white-50 text-decoration-none"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-white-50 text-decoration-none"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white-50 text-decoration-none"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="text-white">Connect With Us</h5>
              <ul className="list-unstyled d-flex">
                <li className="me-3">
                  <a href="#" className="text-white-50">
                    <FaFacebook size={24} />
                  </a>
                </li>
                <li className="me-3">
                  <a href="#" className="text-white-50">
                    <FaTwitter size={24} />
                  </a>
                </li>
                <li className="me-3">
                  <a href="#" className="text-white-50">
                    <FaInstagram size={24} />
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <hr className="bg-white-50 my-3" />
          <p className="text-center mb-0">
            &copy; {new Date().getFullYear()} GadgetGrove. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
