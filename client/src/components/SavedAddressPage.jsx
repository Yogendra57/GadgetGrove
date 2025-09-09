// // // src/pages/SavedAddressesPage.jsx

// // import React, { useState, useEffect } from "react";
// // import { Container, Row, Col, Card, Button } from "react-bootstrap";
// // import LeftSidebar from "./LeftSidebar"; // Import sidebar component
// // import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import api from "../utils/api";

// // // --- Mock Data Simulation ---

// // // --- Address Card Sub-component ---
// // const AddressCard = ({ address, onEdit, onDelete }) => {
// //   return (
// //     <Card className="shadow-sm mb-3 h-100 fade-in-card">
// //       <Card.Body className="d-flex flex-column justify-content-between">
// //         <div>
// //           <Card.Title className="fw-bold">
// //             {address.name }
// //           </Card.Title>
// //           <Card.Text className="text-muted mb-1">{address.address}</Card.Text>
// //           <Card.Text className="text-muted mb-1">
// //             {address.city}, {address.state} - {address.postalCode}
// //           </Card.Text>
// //           <Card.Text className="text-muted">{address.country}</Card.Text>
// //           <Card.Text className="text-muted">Phone: {address.phone}</Card.Text>
// //         </div>
// //         <div className="mt-3 pt-3 border-top">
// //           <Button
// //             variant="outline-primary"
// //             size="sm"
// //             onClick={() => onEdit(address._id)}
// //             className="me-2"
// //           >
// //             <FaEdit className="me-1" /> Edit
// //           </Button>
// //           <Button
// //             variant="outline-danger"
// //             size="sm"
// //             onClick={() => onDelete(address._id)}
// //           >
// //             <FaTrashAlt className="me-1" /> Delete
// //           </Button>
// //         </div>
// //       </Card.Body>
// //     </Card>
// //   );
// // };

// // // --- Main Page Component ---
// // export default function SavedAddressesPage() {
// //   const [addresses, setAddresses] = useState([]);
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const token = localStorage.getItem("token");
// //   // Fetch addresses on component load
// //   useEffect(() => {
// //     const fetchAddresses = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await api.get("/addresses", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         // Axios returns response.data directly
// //         setAddresses(response.data.addresses); // ✅ only the addresses array
// //       } catch (error) {
// //         setError(error.response?.data?.message || error.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (token) {
// //       fetchAddresses();
// //     } else {
// //       setLoading(false);
// //       setError("User not authenticated. Please log in.");
// //     }
// //   }, [token]);

// //   const handleEditAddress = (id) => {
    
// //     navigate(`/edit-address/${id}`);
// //   };

// //   const handleDeleteAddress = async (id) => {
// //     try {
// //       await api.delete(`addresses/${id}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       alert("Address deleted successfully");
// //       setAddresses((prevAddresses) =>
// //         prevAddresses.filter((address) => address._id !== id)
// //       );
// //     } catch (error) {
// //       console.error("Error deleting address:", error);
// //       setError(error.response?.data?.message || error.message);
// //     }
// //   };

// //   const handleAddNewAddress = () => {
// //     console.log("Navigate to add address page");

// //     navigate("/address");
// //   };

// //   return (
// //     <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
// //       <Row>
// //         {/* 1. Left Sidebar Navigation */}
// //         <Col md={2} className="bg-white vh-100 shadow-sm p-0 sticky-top">
// //           {/* Ensure the correct link is set to active in the LeftSidebar component */}
// //           <LeftSidebar />
// //         </Col>

// //         {/* 2. Main Content Area */}
// //         <Col md={10} className="py-4 px-md-5">
// //           <Container>
// //             {/* Header section */}
// //             <div className="d-flex justify-content-between align-items-center mb-4">
// //               <h2 className="h4 fw-bold">My Saved Addresses</h2>
// //               <Button variant="primary" onClick={handleAddNewAddress}>
// //                 <FaPlus className="me-2" /> Add New Address
// //               </Button>
// //             </div>

// //             {/* Address Grid */}
// //             <Row className="gy-4">
// //               {addresses.length > 0 ? (
// //                 addresses.map((address) => (
// //                   <Col lg={6} key={address._id}>
// //                     <AddressCard
// //                       address={address}
// //                       onEdit={handleEditAddress}
// //                       onDelete={handleDeleteAddress}
// //                     />
// //                   </Col>
// //                 ))
// //               ) : (
// //                 <Col>
// //                   <Card body className="text-center text-muted py-5">
// //                     You haven't saved any addresses yet.
// //                   </Card>
// //                 </Col>
// //               )}
// //             </Row>
// //           </Container>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // }


// // src/pages/SavedAddressesPage.jsx

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
// import LeftSidebar from "../components/LeftSidebar"; // Import sidebar component
// import BottomNavbar from "../components/BottomNavbar"; // Import mobile bottom navbar
// import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import "../stylesheets/ResponsiveNavbar.css"; // Import responsive styles

// // --- Address Card Sub-component ---
// const AddressCard = ({ address, onEdit, onDelete }) => {
//   return (
//     <Card className="shadow-sm h-100 fade-in-card">
//       <Card.Body className="d-flex flex-column justify-content-between">
//         <div>
//           <Card.Title className="fw-bold">{address.name}</Card.Title>
//           <Card.Text className="text-muted mb-1">{address.address}</Card.Text>
//           <Card.Text className="text-muted mb-1">
//             {address.city}, {address.state} - {address.postalCode}
//           </Card.Text>
//           <Card.Text className="text-muted mb-1">{address.country}</Card.Text>
//           <Card.Text className="text-muted">Phone: {address.phone}</Card.Text>
//         </div>
//         <div className="mt-3 pt-3 border-top">
//           <Button
//             variant="outline-primary"
//             size="sm"
//             onClick={() => onEdit(address._id)}
//             className="me-2"
//           >
//             <FaEdit className="me-1" /> Edit
//           </Button>
//           <Button
//             variant="outline-danger"
//             size="sm"
//             onClick={() => onDelete(address._id)}
//           >
//             <FaTrashAlt className="me-1" /> Delete
//           </Button>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// // --- Main Page Component ---
// export default function SavedAddressesPage() {
//   const [addresses, setAddresses] = useState([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true); // Set initial loading to true
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const response = await api.get("/addresses", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAddresses(response.data.addresses);
//       } catch (error) {
//         setError(error.response?.data?.message || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchAddresses();
//     } else {
//       setLoading(false);
//       setError("User not authenticated. Please log in.");
//     }
//   }, [token]);

//   const handleEditAddress = (id) => {
//     navigate(`/edit-address/${id}`);
//   };

//   const handleDeleteAddress = async (id) => {
//     try {
//       await api.delete(`addresses/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Address deleted successfully");
//       setAddresses((prevAddresses) =>
//         prevAddresses.filter((address) => address._id !== id)
//       );
//     } catch (error) {
//       console.error("Error deleting address:", error);
//       setError(error.response?.data?.message || error.message);
//     }
//   };

//   const handleAddNewAddress = () => {
//     navigate("/address"); // Assuming "/address" is your route for AddAddressPage
//   };

//   return (
//     <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
//       <Row>
//         {/* 1. Left Sidebar Navigation (Desktop Only) */}
//         <Col md={2} className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top">
//           <LeftSidebar />
//         </Col>

//         {/* 2. Main Content Area */}
//         <Col md={10} className="main-content-area py-4 px-md-5">
//           <Container>
//             {/* Header section */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="h4 fw-bold">My Saved Addresses</h2>
//               <Button variant="primary" onClick={handleAddNewAddress}>
//                 <FaPlus className="me-2" /> Add New Address
//               </Button>
//             </div>

//             {/* Loading and Error Handling */}
//             {loading && (
//               <div className="text-center my-5">
//                 <Spinner animation="border" variant="primary" />
//               </div>
//             )}
//             {error && <Alert variant="danger">{error}</Alert>}

//             {/* Address Grid */}
//             {!loading && !error && (
//               <Row className="gy-4">
//                 {addresses.length > 0 ? (
//                   addresses.map((address) => (
//                     <Col lg={6} key={address._id}>
//                       <AddressCard
//                         address={address}
//                         onEdit={handleEditAddress}
//                         onDelete={handleDeleteAddress}
//                       />
//                     </Col>
//                   ))
//                 ) : (
//                   <Col>
//                     <Card body className="text-center text-muted py-5">
//                       You haven't saved any addresses yet.
//                     </Card>
//                   </Col>
//                 )}
//               </Row>
//             )}
//           </Container>
//         </Col>
//       </Row>
      
//       {/* 3. Mobile Bottom Navigation Bar */}
//       <BottomNavbar />
//     </Container>
//   );
// }




// src/pages/SavedAddressesPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import LeftSidebar from "../components/LeftSidebar";
import BottomNavbar from "../components/BottomNavbar";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../stylesheets/ResponsiveNavbar.css";
import "../stylesheets/SkeletonLoader.css"; // Import CSS for skeleton animation
import { toast } from "react-toastify";

// --- Address Card Sub-component ---
const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <Card className="shadow-sm h-100 fade-in-card"> {/* 'fade-in-card' class for load animation */}
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fw-bold">{address.name}</Card.Title>
          <Card.Text className="text-muted mb-1">{address.address}</Card.Text>
          <Card.Text className="text-muted mb-1">
            {address.city}, {address.state} - {address.postalCode}
          </Card.Text>
          <Card.Text className="text-muted mb-1">{address.country}</Card.Text>
          <Card.Text className="text-muted">Phone: {address.phone}</Card.Text>
        </div>
        <div className="mt-3 pt-3 border-top">
          <Button variant="outline-primary" size="sm" onClick={() => onEdit(address._id)} className="me-2 action-btn-hover">
            <FaEdit className="me-1" /> Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(address._id)} className="action-btn-hover">
            <FaTrashAlt className="me-1" /> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

// --- NEW: Skeleton Loader Component ---
const AddressCardSkeleton = () => {
  return (
    <Card className="shadow-sm h-100 skeleton-card">
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <div className="skeleton-line mb-3" style={{ width: '50%', height: '1.25rem' }}></div>
          <div className="skeleton-line mb-2" style={{ width: '90%' }}></div>
          <div className="skeleton-line mb-2" style={{ width: '70%' }}></div>
          <div className="skeleton-line" style={{ width: '40%' }}></div>
        </div>
        <div className="mt-3 pt-3 border-top d-flex">
          <div className="skeleton-line me-2" style={{ width: '70px', height: '30px' }}></div>
          <div className="skeleton-line" style={{ width: '70px', height: '30px' }}></div>
        </div>
      </Card.Body>
    </Card>
  );
};

// --- Main Page Component ---
export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data.addresses);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        // Add a slight delay to better show the animation a_m.
        setTimeout(() => setLoading(false), 500); 
      }
    };

    if (token) fetchAddresses(); else { setLoading(false); setError("User not authenticated."); toast.error("User not authenticated. Please log in."); }
  }, [token]);

  // ... (handleEditAddress, handleDeleteAddress, handleAddNewAddress functions) ...
const handleEditAddress = (id) => {
    navigate(`/edit-address/${id}`);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Address deleted successfully");
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== id)
      );
    } catch (error) {
      toast.error("Error deleting address.");
      console.error("Error deleting address:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleAddNewAddress = () => {
    navigate("/address"); // Assuming "/address" is your route for AddAddressPage
  };
  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Row>
        <Col md={2} className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top">
          <LeftSidebar />
        </Col>

        <Col md={10} className="main-content-area py-4 px-md-5">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 fw-bold">My Saved Addresses</h2>
              <Button variant="primary" onClick={() => navigate("/address")}>
                <FaPlus className="me-2" /> Add New Address
              </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="gy-4">
              {loading ? (
                // Render skeleton cards during loading state
                [1, 2, 3, 4].map((n) => (
                  <Col lg={6} key={n}>
                    <AddressCardSkeleton />
                  </Col>
                ))
              ) : addresses.length > 0 ? (
                addresses.map((address) => (
                  <Col lg={6} key={address._id}>
                    <AddressCard
                      address={address}
                      onEdit={handleEditAddress}
                      onDelete={handleDeleteAddress}
                    />
                  </Col>
                ))
              ) : (
                <Col>
                  <Card body className="text-center text-muted py-5">
                    You haven't saved any addresses yet.
                  </Card>
                </Col>
              )}
            </Row>
          </Container>
        </Col>
      </Row>
      <BottomNavbar />
    </Container>
  );
}