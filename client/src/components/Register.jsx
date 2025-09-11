// src/components/Register.jsx

import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, Button, FloatingLabel, ProgressBar, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../stylesheets/Register.css"; 
import { FaArrowRight, FaArrowLeft, FaUserCheck, FaTruckLoading, FaShieldAlt } from "react-icons/fa";

const Register = () => {
  const totalSteps = 2;
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    setValidated(true);
    if (step === 1) {
      if (formData.name && formData.email && formData.password.length >= 6) {
        setStep(step + 1);
        setValidated(false);
        setError("");
      } else if (formData.password.length > 0 && formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
      } else {
        setError("Please fill in all account details correctly.");
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
    setValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (!formData.street || !formData.city || !formData.state || !formData.zip) {
      setError("Please fill in all address details.");
      return;
    }
    setError("");
    console.log("Signup Data:", formData);
    // ... API call logic ...
  };

  const progressPercent = useMemo(() => ((step - 1) / totalSteps) * 100 + 50, [step]);

  return (
    <div className="register-container-vibrant">
      <Container className="h-100">
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col md={10} lg={8} xl={7}>
            <div className="glass-card">
              <div className="card-header text-center p-4 border-bottom-0">
                <h2 className="text-white mb-1 fw-bold">Create Your Account</h2>
                <p className="text-white-50 small mb-3">Step {step}: {step === 1 ? "Account Details" : "Shipping Address"}</p>
                <ProgressBar now={progressPercent} className="progress-bar-custom" />
              </div>

              <div className="form-slide-container">
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="position-relative">
                  {/* --- Step 1: Account Information --- */}
                  <div className={`form-step ${step === 1 ? 'active' : 'inactive-left'}`}>
                    <div className="step-content p-4 p-md-5">
                      <div className="text-center mb-3 step-icon-wrapper">
                        <FaShieldAlt size={40} className="step-icon" />
                      </div>
                      <FloatingLabel controlId="floatingName" label="Full Name" className="mb-3">
                        <Form.Control type="text" placeholder="John Doe" name="name" value={formData.name} onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">Please enter your name.</Form.Control.Feedback>
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3">
                        <Form.Control type="email" placeholder="name@example.com" name="email" value={formData.email} onChange={handleChange} required />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingPassword" label="Password (min. 6 characters)" className="mb-3">
                        <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                      </FloatingLabel>
                    </div>
                  </div>

                  {/* --- Step 2: Shipping Address --- */}
                  <div className={`form-step ${step === 2 ? 'active' : 'inactive-right'}`}>
                    <div className="step-content p-4 p-md-5">
                       <div className="text-center mb-3 step-icon-wrapper">
                        <FaTruckLoading size={40} className="step-icon" />
                      </div>
                      <FloatingLabel controlId="floatingStreet" label="Street Address" className="mb-3">
                        <Form.Control type="text" placeholder="123 Main St" name="street" value={formData.street} onChange={handleChange} required />
                      </FloatingLabel>
                      <Row>
                        <Col md={6}>
                          <FloatingLabel controlId="floatingCity" label="City" className="mb-3">
                            <Form.Control type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} required />
                          </FloatingLabel>
                        </Col>
                        <Col md={6}>
                          <FloatingLabel controlId="floatingZip" label="ZIP Code" className="mb-3">
                            <Form.Control type="text" placeholder="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} required />
                          </FloatingLabel>
                        </Col>
                      </Row>
                      <FloatingLabel controlId="floatingState" label="State" className="mb-3">
                        <Form.Control type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} required />
                      </FloatingLabel>
                    </div>
                  </div>
                </Form>
              </div>
              
              <div className="card-footer bg-transparent border-top-0 p-4">
                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between navigation-buttons">
                  <Button variant="light" onClick={prevStep} className={`button-prev ${step > 1 ? 'visible' : 'invisible'}`}>
                    <FaArrowLeft className="me-2" /> Back
                  </Button>
                  {step < totalSteps ? (
                    <Button variant="light" onClick={handleNextStep} className="button-next">
                      Next Step <FaArrowRight className="ms-2" />
                    </Button>
                  ) : (
                    <Button type="submit" onClick={handleSubmit} className="button-submit w-100">
                      <FaUserCheck className="me-2" /> Create Account
                    </Button>
                  )}
                </div>
                <div className="text-center mt-4">
                  <Link to="/login" className="text-white-50 small link-hover">Already have an account? Log In</Link>
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;