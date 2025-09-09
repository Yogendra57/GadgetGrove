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
} from "react-bootstrap";
import LeftSidebar from "./LeftSidebar";
import { useParams, useNavigate } from "react-router-dom"; // Import hooks for routing
import api from "../utils/api";
import { toast } from "react-toastify";

// --- Data: List of Indian States and Union Territories ---
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
indianStates.sort();

export default function EditAddressPage() {
  // --- State Initialization ---

  const [formData, setFormData] = useState();
  const [validated, setValidated] = useState(false);
  const [formAlert, setFormAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- React Router Hooks ---
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const response = await api.get(`/addresses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          name: response.data.address.name || "",
          address: response.data.address.address || "",
          city: response.data.address.city || "",
          postalCode: response.data.address.postalCode || "",
          state: response.data.address.state || "",
          country: response.data.address.country || "India",
          phone: response.data.address.phone || "",
        });
        toast.success("Address fetched successfully!");
      } catch (error) {
        toast.error("Failed to fetch address.");
        console.error("Error fetching address:", error);
        setFormAlert({
          show: true,
          message: error.response?.data?.message || error.message,
          variant: "danger",
        });
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressData();
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

      const response = await api.put(`/addresses/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormAlert({
        show: true,
        message: response.data.message || "Address updated successfully!",
        variant: "success",
      });
      toast.success("Address updated successfully!");

      // Redirect after short delay
      setTimeout(() => navigate("/saved-addresses"), 2000);
    } catch (error) {
      toast.error("Failed to update address.");
      console.error("Error updating address:", error);
      setFormAlert({
        show: true,
        message: error.response?.data?.message || error.message,
        variant: "danger",
      });
    }
  };

  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Row>
        {/* 1. Left Sidebar Navigation */}
        <Col md={2} className="bg-white vh-100 shadow-sm p-0 sticky-top">
          <LeftSidebar />
        </Col>

        {/* 2. Main Content Area */}
        <Col md={10} className="py-4 px-md-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={7}>
                <Card className="shadow-lg border-0 rounded-3 fade-in-card">
                  <Card.Body className="p-4 p-md-5">
                    <h2 className="h4 mb-4 fw-bold text-center">
                      Edit Delivery Address
                    </h2>

                    {formAlert.show && (
                      <Alert
                        variant={formAlert.variant}
                        onClose={() =>
                          setFormAlert({ ...formAlert, show: false })
                        }
                        dismissible
                      >
                        {formAlert.message}
                      </Alert>
                    )}

                    {isLoading ? (
                      <div className="text-center p-5">
                        Loading address data...
                      </div>
                    ) : (
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                      >
                        <Form.Group className="mb-3" controlId="formGridName">
                          <FloatingLabel
                            controlId="floatingName"
                            label="Full Name"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Enter full name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter your full name.
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Form.Group>
                        {/* Street Address Field */}
                        <Form.Group
                          className="mb-3"
                          controlId="formGridAddress"
                        >
                          <FloatingLabel
                            controlId="floatingAddress"
                            label="Street Address"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Enter street address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              style={{ minHeight: "60px" }}
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a street address.
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Form.Group>

                        <Row className="mb-3">
                          {/* City Field */}
                          <Form.Group as={Col} md="6" controlId="formGridCity">
                            <FloatingLabel
                              controlId="floatingCity"
                              label="City"
                            >
                              <Form.Control
                                type="text"
                                placeholder="Enter city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                              </Form.Control.Feedback>
                            </FloatingLabel>
                          </Form.Group>

                          {/* Postal Code Field */}
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="formGridPostalCode"
                          >
                            <FloatingLabel
                              controlId="floatingPostalCode"
                              label="Postal Code"
                            >
                              <Form.Control
                                type="text"
                                placeholder="Enter postal code"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a postal code.
                              </Form.Control.Feedback>
                            </FloatingLabel>
                          </Form.Group>
                        </Row>

                        <Row className="mb-4">
                          {/* State Field */}
                          <Form.Group as={Col} md="6" controlId="formGridState">
                            <FloatingLabel
                              controlId="floatingState"
                              label="State"
                            >
                              <Form.Select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select State...</option>
                                {indianStates.map((stateName) => (
                                  <option key={stateName} value={stateName}>
                                    {stateName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Please select a state.
                              </Form.Control.Feedback>
                            </FloatingLabel>
                          </Form.Group>

                          {/* Country Field (Read-only) */}
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="formGridCountry"
                          >
                            <FloatingLabel
                              controlId="floatingCountry"
                              label="Country"
                            >
                              <Form.Control
                                type="text"
                                name="country"
                                value={formData.country}
                                readOnly
                                style={{ backgroundColor: "#e9ecef" }}
                              />
                            </FloatingLabel>
                          </Form.Group>
                          <Form.Group
                            className="mb-1 mt-3"
                            controlId="formGridPhone"
                          >
                            <FloatingLabel
                              controlId="floatingPhone"
                              label="Phone Number"
                            >
                              <Form.Control
                                type="tel"
                                placeholder="Enter 10-digit phone number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                pattern="[6-9][0-9]{9}" // Validation for Indian mobile numbers (starts with 6, 7, 8, or 9)
                              />
                              <Form.Control.Feedback type="invalid">
                                Please enter a valid 10-digit mobile number.
                              </Form.Control.Feedback>
                            </FloatingLabel>
                          </Form.Group>
                        </Row>

                        <div className="d-grid gap-2">
                          <Button variant="primary" type="submit" size="lg">
                            Update Address
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={() => navigate("/saved-addresses")}
                          >
                            Cancel
                          </Button>
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
    </Container>
  );
}
