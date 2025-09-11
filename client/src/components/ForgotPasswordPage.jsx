// src/pages/ForgotPasswordPage.jsx

import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, Button, FloatingLabel, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../stylesheets/SignupPage.css"; 
import { FaEnvelope, FaKey, FaCheckCircle, FaChevronLeft, FaLock } from "react-icons/fa"; 
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Step 1: Handle Request OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // The backend responds with a generic success message even if email doesn't exist
      // to prevent email enumeration attacks.
      await api.post("/auth/forgot-password", { email: formData.email });
      setLoading(false);
      setSuccessMessage(`If an account exists for ${formData.email}, a reset code has been sent.`);
      toast.success(`If an account exists for ${formData.email}, a reset code has been sent.`);
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      toast.error("An error occurred.");
      setLoading(false);
    }
  };

  // --- Step 2: Handle Password Reset ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newpassword: formData.newPassword,
      });
      setLoading(false);
      setSuccessMessage(res.data.message);
      toast.success(res.data.message);
      setStep(3); // Move to success step
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
      toast.error("Password reset failed.");
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper"> {/* Reusing class from SignupPage.css */}
      {/* Background Container for Image/Video */}
      <div className="background-media-container">
        {/* *** ACTION REQUIRED ***
          Place your video file in the /public folder (e.g., /public/your-background-video.mp4).
          Then, uncomment the line below and update the 'src' attribute.
        */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/forgotvedio2.mp4" 
        ></video>
      </div>

      <Container className="signup-form-container">
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col md={6} lg={5}>
            <div className="signup-card frosted-glass-effect animated-fade-in">
              <div className="p-4 p-md-5">

                {/* --- Step 1: Email Form --- */}
                {step === 1 && (
                  <form onSubmit={handleRequestOtp} className="form-step-animation">
                    <h3 className="text-center text-white fw-bold mb-2">Forgot Password?</h3>
                    <p className="text-center text-white-50 small mb-4">No worries! Enter your email below to receive a password reset code.</p>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <FloatingLabel controlId="floatingEmail" label={<><FaEnvelope className="me-2" /> Email address</>} className="mb-3 custom-floating-label">
                      <Form.Control type="email" placeholder="name@example.com" name="email" value={formData.email} onChange={handleChange} required />
                    </FloatingLabel>
                    <div className="d-grid mt-4">
                      <Button variant="primary" type="submit" size="lg" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Send Reset Code"}
                      </Button>
                    </div>
                  </form>
                )}

                {/* --- Step 2: OTP and New Password Form --- */}
                {step === 2 && (
                  <form onSubmit={handleResetPassword} className="form-step-animation">
                    <h3 className="text-center text-white fw-bold mb-3">Reset Your Password</h3>
                    {successMessage && <Alert variant="success" className="small py-2">{successMessage}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <FloatingLabel controlId="floatingOtp" label={<><FaKey className="me-2" /> Verification Code (OTP)</>} className="mb-3 custom-floating-label">
                      <Form.Control type="text" placeholder="123456" name="otp" value={formData.otp} onChange={handleChange} required maxLength="6" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingNewPassword" label={<><FaLock className="me-2" /> New Password</>} className="mb-3 custom-floating-label">
                      <Form.Control type="password" placeholder="New Password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingConfirmPassword" label={<><FaLock className="me-2" /> Confirm New Password</>} className="mb-3 custom-floating-label">
                      <Form.Control type="password" placeholder="Confirm New Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </FloatingLabel>

                    <div className="d-grid mt-4">
                      <Button variant="success" type="submit" size="lg" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Update Password"}
                      </Button>
                    </div>
                     <div className="text-center mt-3">
                      <Button variant="link" className="text-white-50 small text-decoration-none" onClick={() => setStep(1)} disabled={loading}>
                        <FaChevronLeft className="me-1" /> Back to email input
                      </Button>
                    </div>
                  </form>
                )}

                {/* --- Step 3: Success Screen --- */}
                {step === 3 && (
                  <div className="text-center text-white form-step-animation">
                    <FaCheckCircle size={60} className="text-success success-icon mb-4" />
                    <h2 className="fw-bold mb-3">Password Updated!</h2>
                    <p className="fs-5 mb-4">{successMessage}</p>
                    <Button variant="light" size="lg" className="w-100" onClick={() => navigate("/login")}>
                      Back to Login
                    </Button>
                  </div>
                )}

              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;