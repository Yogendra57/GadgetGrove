// src/pages/EditAddressPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  FloatingLabel,
  Alert,
  Spinner // Import Spinner for a better loading state
} from "react-bootstrap";
import LeftSidebar from "../components/LeftSidebar"; // Corrected path
import BottomNavbar from "../components/BottomNavbar"; // Import mobile bottom navbar
import { useParams, useNavigate } from "react-router-dom"; 
import api from "../utils/api";
import { toast } from "react-toastify";
import "../stylesheets/ResponsiveNavbar.css"; // Import responsive CSS

// --- Data: List of Indian States and Union Territories ---
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
indianStates.sort();

export default function EditAddressPage() {
  // --- State Initialization ---
  const [formData, setFormData] = useState({
    name: "", address: "", city: "", postalCode: "",
    state: "", country: "India", phone: "",
  });
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Use a single error state

  // --- React Router Hooks ---
  const { id: addressId } = useParams(); // Renamed 'id' to 'addressId' for clarity
  const navigate = useNavigate();

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/addresses/${addressId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(data.address);
      } catch (err) {
        toast.error("Failed to fetch address details.");
        setError(err.response?.data?.message || "Could not load address.");
      } finally {
        setIsLoading(false);
      }
    };
    if (addressId) {
        fetchAddressData();
    }
  }, [addressId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    try {
      const token = localStorage.getItem("token");
      await api.put(`/addresses/${addressId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Address updated successfully!");
      setTimeout(() => navigate("/saved-addresses"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update address.");
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* 1. Left Sidebar Navigation (Desktop Only) */}
        <Col md={2} className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top">
          <LeftSidebar />
        </Col>

        {/* 2. Main Content Area */}
        <Col md={10} className="main-content-area py-4 px-md-5" style={{ backgroundColor: "#f8f9fa" }}>
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={7}>
                <Card className="shadow-lg border-0 rounded-3 fade-in-card">
                  <Card.Body className="p-4 p-md-5">
                    <h2 className="h4 mb-4 fw-bold text-center">
                      Edit Delivery Address
                    </h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {isLoading ? (
                      <div className="text-center p-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading address data...</p>
                      </div>
                    ) : (
                      <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <Form.Group className="mb-3">
                          <FloatingLabel controlId="floatingName" label="Full Name">
                            <Form.Control type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
                          </FloatingLabel>
                        </Form.Group>
                        {/* Street Address */}
                        <Form.Group className="mb-3">
                          <FloatingLabel controlId="floatingAddress" label="Street Address">
                            <Form.Control type="text" name="address" value={formData.address || ''} onChange={handleChange} required style={{ minHeight: "60px" }} />
                          </FloatingLabel>
                        </Form.Group>
                        {/* City & Postal Code */}
                        <Row className="mb-3">
                          <Form.Group as={Col} md={6}>
                            <FloatingLabel controlId="floatingCity" label="City">
                              <Form.Control type="text" name="city" value={formData.city || ''} onChange={handleChange} required />
                            </FloatingLabel>
                          </Form.Group>
                          <Form.Group as={Col} md={6}>
                            <FloatingLabel controlId="floatingPostalCode" label="Postal Code">
                              <Form.Control type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} required pattern="\d{6}" />
                            </FloatingLabel>
                          </Form.Group>
                        </Row>
                        {/* State & Country */}
                        <Row className="mb-3">
                          <Form.Group as={Col} md={6}>
                            <FloatingLabel controlId="floatingState" label="State">
                              <Form.Select name="state" value={formData.state || ''} onChange={handleChange} required>
                                <option value="">Select State...</option>
                                {indianStates.map((stateName) => (<option key={stateName} value={stateName}>{stateName}</option>))}
                              </Form.Select>
                            </FloatingLabel>
                          </Form.Group>
                          <Form.Group as={Col} md={6}>
                            <FloatingLabel controlId="floatingCountry" label="Country">
                              <Form.Control type="text" name="country" value={formData.country || ''} readOnly style={{ backgroundColor: "#e9ecef" }} />
                            </FloatingLabel>
                          </Form.Group>
                        </Row>
                        {/* Phone Number */}
                        <Form.Group className="mb-4">
                            <FloatingLabel controlId="floatingPhone" label="Phone Number">
                              <Form.Control type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required pattern="[6-9][0-9]{9}" />
                            </FloatingLabel>
                        </Form.Group>
                        {/* Buttons */}
                        <div className="d-grid gap-2">
                          <Button variant="primary" type="submit" size="lg">Update Address</Button>
                          <Button variant="outline-secondary" onClick={() => navigate("/saved-addresses")}>Cancel</Button>
                        </div>
                      </Form>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* 3. Mobile Bottom Navigation Bar */}
      <BottomNavbar />
    </Container>
  );
}