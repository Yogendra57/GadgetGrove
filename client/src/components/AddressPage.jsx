
// src/pages/AddAddressPage.jsx

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  FloatingLabel,
  Alert,
} from "react-bootstrap";
import LeftSidebar from "../components/LeftSidebar";
import BottomNavbar from "../components/BottomNavbar"; 
import api from "../utils/api";
import { toast } from "react-toastify";
import "../stylesheets/ResponsiveNavbar.css"; 

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

export default function AddAddressPage() {
  const initialFormData = {
    name: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "India",
    phone: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);
  
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
      await api.post("/addresses", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Address added successfully!");
      setFormData(initialFormData); // Reset the entire form
      setValidated(false); // Reset validation state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address.");
      console.error("Error adding address:", error);
    }
  };
  
  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Row>
        {/* 1. Left Sidebar Navigation (Desktop Only) */}
        <Col md={2} className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top">
          <LeftSidebar />
        </Col>

        {/* 2. Main Content Area */}
        <Col md={10} className="main-content-area py-4 px-md-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={7}>
                <Card className="shadow-lg border-0 rounded-3 fade-in-card">
                  <Card.Body className="p-4 p-md-5">
                    <h2 className="h4 mb-4 fw-bold text-center">
                      Add New Delivery Address
                    </h2>
                    
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      {/* --- Name Field --- */}
                      <Form.Group className="mb-3" controlId="formGridName">
                        <FloatingLabel controlId="floatingName" label="Full Name">
                          <Form.Control type="text" placeholder="Enter full name" name="name" value={formData.name} onChange={handleChange} required />
                          <Form.Control.Feedback type="invalid">Please enter your full name.</Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>

                      {/* --- Street Address Field --- */}
                      <Form.Group className="mb-3" controlId="formGridAddress">
                        <FloatingLabel controlId="floatingAddress" label="Street Address (House No, Building, Area)">
                          <Form.Control type="text" placeholder="Enter street address" name="address" value={formData.address} onChange={handleChange} required style={{ minHeight: "60px" }} />
                          <Form.Control.Feedback type="invalid">Please provide a street address.</Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>

                      {/* City & Postal Code */}
                      <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="formGridCity">
                          <FloatingLabel controlId="floatingCity" label="City">
                            <Form.Control type="text" placeholder="Enter city" name="city" value={formData.city} onChange={handleChange} required />
                            <Form.Control.Feedback type="invalid">Please provide a valid city.</Form.Control.Feedback>
                          </FloatingLabel>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="formGridPostalCode">
                          <FloatingLabel controlId="floatingPostalCode" label="Postal Code">
                            <Form.Control type="text" placeholder="Enter postal code" name="postalCode" value={formData.postalCode} onChange={handleChange} required pattern="\d{6}" />
                            <Form.Control.Feedback type="invalid">Please provide a valid 6-digit postal code.</Form.Control.Feedback>
                          </FloatingLabel>
                        </Form.Group>
                      </Row>

                      {/* State & Country */}
                      <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="formGridState">
                          <FloatingLabel controlId="floatingState" label="State">
                            <Form.Select name="state" value={formData.state} onChange={handleChange} required>
                              <option value="">Select State...</option>
                              {indianStates.map((stateName) => (<option key={stateName} value={stateName}>{stateName}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Please select a state.</Form.Control.Feedback>
                          </FloatingLabel>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="formGridCountry">
                          <FloatingLabel controlId="floatingCountry" label="Country">
                            <Form.Control type="text" name="country" value={formData.country} readOnly style={{ backgroundColor: "#e9ecef" }} />
                          </FloatingLabel>
                        </Form.Group>
                      </Row>

                      {/* --- Phone Number Field --- */}
                      <Form.Group className="mb-4" controlId="formGridPhone">
                        <FloatingLabel controlId="floatingPhone" label="Phone Number">
                          <Form.Control type="tel" placeholder="Enter 10-digit phone number" name="phone" value={formData.phone} onChange={handleChange} required pattern="[6-9][0-9]{9}" />
                          <Form.Control.Feedback type="invalid">Please enter a valid 10-digit mobile number.</Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg">Save Address</Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* --- 3. Mobile Bottom Navigation Bar --- */}
      <BottomNavbar />
    </Container>
  );
}