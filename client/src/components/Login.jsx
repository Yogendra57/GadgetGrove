// src/components/Login.jsx

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "../stylesheets/LoginModern.css"; // We'll create this new CSS file
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/authSlice";
import { toast } from 'react-toastify'; // Import toast function

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for login errors
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const loginUser = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await api.post("/auth/login", { email, password });
      const token=res.data.token;
      const accountData = res.data.account; 
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(accountData));
    dispatch(
        setLogin({
          user: res.data.account, // The user object from your backend response
          token: res.data.token,
        })
      );
      // Show success toast
       if (accountData.isAdmin) {
        navigate('/admin/dashboard');
        toast.info(`Welcome ${accountData.name}! Redirecting to dashboard.`);
      } else {
        toast.info(`Welcome ${accountData.name}! Redirecting to products.`);
        navigate('/products');
      }
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      toast.error("Invalid email or password. Please try again.");
      setError("Invalid email or password. Please try again."); // Display user-friendly error
    }
  };

  return (
    <div className="login-page-container">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={10} lg={8}>
            <Card className="login-card shadow-lg border-0 rounded-3 overflow-hidden">
              <Row className="g-0">
                {/* Image Section */}
                <Col md={6} className="d-none d-md-block login-image-section">
                  {/* Background image set via CSS */}
                  <div className="image-overlay-content text-white p-4">
                    <h2 className="display-5 fw-bold mb-3">Welcome Back!</h2>
                    <p className="lead">
                      Log in to access exclusive deals, manage your orders, and enjoy a seamless shopping experience.
                    </p>
                  </div>
                </Col>

                {/* Form Section */}
                <Col md={6}>
                  <Card.Body className="p-4 p-lg-5">
                    <div className="text-center mb-4">
                      {/* You can place your logo here */}
                      {/* <img src="/logo.png" alt="E-commerce Logo" style={{ width: "150px", marginBottom: "1rem" }} /> */}
                      <h3 className="fw-bold text-dark">Account Login</h3>
                      <p className="text-muted small">Enter your credentials to access your account.</p>
                    </div>

                    {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

                    <Form onSubmit={loginUser}>
                      {/* Email Input */}
                      <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3">
                        <Form.Control
                          type="email"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FloatingLabel>

                      {/* Password Input */}
                      <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </FloatingLabel>

                      <div className="d-flex justify-content-end mb-3">
                        <Link to="/forgot-password" className="text-decoration-none small">Forgot Password?</Link>
                      </div>

                      {/* Submit Button */}
                      <div className="d-grid mb-3">
                        <Button variant="primary" type="submit" size="lg" className="login-button fw-bold">
                          Sign In
                        </Button>
                      </div>

                      {/* Social Login Separator */}
                      <Row className="my-3 align-items-center">
                        <Col><hr /></Col>
                        <Col xs="auto" className="text-muted small">OR CONTINUE WITH</Col>
                        <Col><hr /></Col>
                      </Row>

                      {/* Social Login Buttons */}
                      <Row>
                        <Col xs={6}>
                          <Button variant="outline-danger" className="w-100 d-flex align-items-center justify-content-center social-button">
                            <FaGoogle className="me-2" /> Google
                          </Button>
                        </Col>
                        <Col xs={6}>
                          <Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center social-button">
                            <FaFacebookF className="me-2" /> Facebook
                          </Button>
                        </Col>
                      </Row>

                      {/* Register Link */}
                      <div className="text-center mt-4">
                        <p className="text-muted small">
                          Don't have an account? <Link to="/signup" className="fw-bold text-decoration-none">Sign up now</Link>
                        </p>
                      </div>
                    </Form>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;