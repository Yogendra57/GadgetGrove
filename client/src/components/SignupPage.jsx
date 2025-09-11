import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
  ProgressBar,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../stylesheets/SignupPage.css"; 
import { FaUserAlt, FaLock, FaEnvelope, FaKey, FaCheckCircle, FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const SignupPage = () => {
  const totalSteps = 3; // Step 1: Credentials, Step 2: OTP, Step 3: Success
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError(""); // Clear error on new input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setLoading(false);
      setStep(2);
      toast.success("Registration successful! Please check your email for the OTP.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      toast.success("Account verified successfully!");
      setLoading(false);
      setStep(3); // Move to success step
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
      setLoading(false);
    }
  };

  // Calculate progress bar percentage
  const progressPercent = useMemo(() => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    if (step === 3) return 100;
    return 0;
  }, [step]);

  // Determine current step title
  const stepTitle = useMemo(() => {
    if (step === 1) return "Create Your Account";
    if (step === 2) return "Verify Your Email";
    if (step === 3) return "Account Verified!";
    return "";
  }, [step]);

  return (
    <div className="signup-wrapper">
      {/* Background Container for Image/Video */}
      <div className="background-media-container">
        {/* *** ACTION REQUIRED ***
          Uncomment one of these lines and replace the path with your media file.
          Place your image/video file in the /public folder of your React project.
        */}
        {/* <img src="/background-image.jpg" alt="Background" /> */}
        <video autoPlay loop muted playsInline src="/signupvedio.mp4"></video>
      </div>

      <Container className="signup-form-container">
        <Row className="justify-content-center align-items-center min-vh-100 py-5">
          <Col md={7} lg={6} xl={5}>
            <div className="signup-card frosted-glass-effect animated-fade-in">
              <div className="p-4 p-md-5">
                {/* Header with Title and Progress */}
                <div className="text-center mb-4">
                  <h1 className="display-6 text-white fw-bold mb-2">{stepTitle}</h1>
                  {step < 3 && (
                     <p className="text-white-50 current-step-indicator">Step {step} of {totalSteps - 1}</p>
                  )}
                  <ProgressBar now={progressPercent} className="mt-3 progress-bar-custom" />
                </div>

                {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

                {/* --- Step 1: Account Details --- */}
                {step === 1 && (
                  <form onSubmit={handleRegisterSubmit} className="form-step-animation">
                    <FloatingLabel controlId="floatingName" label={<><FaUserAlt className="me-2" /> Full Name</>} className="mb-3 custom-floating-label">
                      <Form.Control type="text" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingEmail" label={<><FaEnvelope className="me-2" /> Email address</>} className="mb-3 custom-floating-label">
                      <Form.Control type="email" placeholder="Email address" name="email" value={formData.email} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPassword" label={<><FaLock className="me-2" /> Password</>} className="mb-3 custom-floating-label">
                      <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingConfirmPassword" label={<><FaLock className="me-2" /> Confirm Password</>} className="mb-3 custom-floating-label">
                      <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </FloatingLabel>
                    <div className="d-grid mt-4">
                      <Button variant="primary" type="submit" size="lg" disabled={loading}>
                        {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Sending OTP...</> : "Next: Get OTP"}
                      </Button>
                    </div>
                    <p className="text-center text-white-50 mt-3 mb-0">
                      Already have an account? <Link to="/login" className="text-white fw-bold text-decoration-none">Log In</Link>
                    </p>
                  </form>
                )}

                {/* --- Step 2: OTP Verification --- */}
                {step === 2 && (
                  <form onSubmit={handleOtpVerification} className="form-step-animation">
                    <p className="text-center text-white-75 mb-4">
                      Please enter the 6-digit verification code sent to <span className="fw-bold">{formData.email}</span>.
                    </p>
                    <FloatingLabel controlId="floatingOtp" label={<><FaKey className="me-2" /> Verification Code (OTP)</>} className="mb-3 custom-floating-label">
                      <Form.Control type="text" placeholder="Verification Code (OTP)" name="otp" value={formData.otp} onChange={handleChange} required maxLength="6" pattern="[0-9]{6}" />
                    </FloatingLabel>
                    <div className="d-grid mt-4">
                      <Button variant="success" type="submit" size="lg" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : "Verify Account"}
                      </Button>
                    </div>
                    <div className="text-center mt-3">
                      <Button variant="link" className="text-white-50 small text-decoration-none" onClick={() => setStep(1)} disabled={loading}>
                        <FaChevronLeft className="me-1" /> Back to details
                      </Button>
                    </div>
                  </form>
                )}

                {/* --- Step 3: Success --- */}
                {step === 3 && (
                  <div className="text-center text-white form-step-animation">
                    <FaCheckCircle size={80} className="text-success success-icon mb-4" />
                    <h2 className="fw-bold mb-3">Welcome Aboard!</h2>
                    <p className="fs-5 mb-4">Your account has been successfully created and verified.</p>
                    <Button variant="light" size="lg" className="w-100" onClick={() => navigate("/login")}>
                      Proceed to Login
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

export default SignupPage;