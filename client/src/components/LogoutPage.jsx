// src/pages/LogoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; // Using a clean icon

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(5);
  const [logoutState, setLogoutState] = useState('processing'); // processing -> success
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clear user session data immediately
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Simulate logout process and switch to success message
    const processingTimeout = setTimeout(() => {
      setLogoutState('success');
    }, 1500); // Wait 1.5 seconds before showing "Thank You"

    // 3. Countdown timer for display
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // 4. Redirect timer (total time 5 seconds)
    const redirectTimeout = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(processingTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    // Add 'fade-out' class when countdown reaches 1 second to start fading page
    <Container fluid className={`logout-container ${countdown <= 1 ? 'fade-out' : ''}`}>
      <Row className="justify-content-center align-items-center vh-100 text-center">
        <Col md={6}>
          {logoutState === 'processing' ? (
            <div className="animation-phase fade-in">
              <h1 className="display-4 fw-light text-muted">Logging Out</h1>
              <p className="lead text-muted">Please wait...</p>
            </div>
          ) : (
            <div className="animation-phase fade-in">
              <FaCheckCircle className="success-icon mb-3" />
              <h1 className="display-4 fw-bold">Thank You!</h1>
              <p className="lead text-muted">We hope to see you again soon.</p>
              <p className="small text-muted mt-4">Redirecting in {countdown}...</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}