import React from 'react';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import Product from './Product';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'; // Import layout components
import LeftSidebar from './LeftSidebar'; // Import desktop sidebar
import BottomNavbar from './BottomNavbar'; // Import mobile bottom navbar
import "../stylesheets/ResponsiveNavbar.css"; // Import responsive CSS
import { toast } from 'react-toastify';

const ProductDisplay = () => {
    const token = localStorage.getItem('token');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data.product);
            } catch (error) {
                console.log(error);
                setError(error.message);
                toast.error("Failed to fetch product.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProduct();
        } else {
            setError('You are not authenticated');
            toast.error("You are not authenticated. Please log in.");
            setLoading(false); // Stop loading if not authenticated
        }
    }, [token, id]); // Added id to dependency array

    // Helper function to render content based on state
    const renderProductContent = () => {
        if (loading) {
            return (
                <div className="text-center my-5 p-5">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }
        if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }
        if (data) {
            return <Product product={data} />;
        }
        return <Alert variant="info">Product not found.</Alert>;
    };

    return (
        <Container fluid>
            <Row>
                {/* --- Sidebar Column (Desktop Only) --- */}
                <Col md={2} lg={2} className="desktop-sidebar bg-light vh-100 p-0 shadow-sm sticky-top">
                    <LeftSidebar />
                </Col>

                {/* --- Main Content Column --- */}
                <Col md={10} lg={10} className="main-content-area">
                    <div className="p-md-4"> {/* Add padding for content area */}
                        {renderProductContent()}
                    </div>
                </Col>
            </Row>

            {/* --- Mobile Bottom Navigation --- */}
            <BottomNavbar />
        </Container>
    );
}

export default ProductDisplay;