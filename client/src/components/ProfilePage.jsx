// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import LeftSidebar from "./LeftSidebar";
// import "../stylesheets/ProfilePage.css";
// import { FaEdit, FaCamera, FaTimes } from "react-icons/fa";
// import api from "../utils/api";

// export default function ProfilePage() {
//     const BACKEND_URL = "http://localhost:8000";
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [validated, setValidated] = useState(false);
//   const [formAlert, setFormAlert] = useState({
//     show: false,
//     message: "",
//     variant: "success",
//   });

//   const [userData, setUserData] = useState({});
//   const [profileData, setProfileData] = useState({});
//   const [editFormData, setEditFormData] = useState({});
//   const [selectedFiles, setSelectedFiles] = useState({
//     profileImageFile: null,
//     coverImageFile: null,
//   });
//   const [imagePreviews, setImagePreviews] = useState({
//     profile: null,
//     cover: null,
//   });

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await api.get("/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfileData(response.data.profile);

//         const user = await api.get("/auth", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserData(user.data.user);
//       } catch (error) {
//         console.error("Failed to fetch profile data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (token) {
//       fetchProfileData();
//     }
//   }, [token]);

//   const handleEditToggle = () => {
//     if (!isEditing) {
//       setEditFormData({ ...userData, ...profileData });
//       setValidated(false);
//       setImagePreviews({ profile: null, cover: null });
//       setSelectedFiles({ profileImageFile: null, coverImageFile: null });
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleChange = (e) => {
//     setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e, imageType) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (imageType === "profile") {
//       setSelectedFiles((prev) => ({ ...prev, profileImageFile: file }));
//     } else {
//       setSelectedFiles((prev) => ({ ...prev, coverImageFile: file }));
//     }

//     setImagePreviews((prev) => ({
//       ...prev,
//       [imageType]: URL.createObjectURL(file),
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.stopPropagation();
//       setValidated(true);
//       return;
//     }

//     setIsLoading(true);

//     const formDataToUpload = new FormData();
//     formDataToUpload.append("name", editFormData.name);
//     formDataToUpload.append("bio", editFormData.bio);
//     formDataToUpload.append("location", editFormData.location);
//     formDataToUpload.append("website", editFormData.website);

//     if (selectedFiles.profileImageFile) {
//       formDataToUpload.append("profileImage", selectedFiles.profileImageFile);
//     }
//     if (selectedFiles.coverImageFile) {
//       formDataToUpload.append("coverImage", selectedFiles.coverImageFile);
//     }

//     try {
//       const response = await api.put("/profile", formDataToUpload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setProfileData(response.data.profile);
//       setUserData(response.data.user);

//       setIsLoading(false);
//       setIsEditing(false);
//       setFormAlert({
//         show: true,
//         message: "Profile updated successfully!",
//         variant: "success",
//       });
//       setTimeout(
//         () => setFormAlert((prev) => ({ ...prev, show: false })),
//         3000
//       );
//     } catch (error) {
//       console.error(error);
//       setFormAlert({
//         show: true,
//         message: "Failed to update profile.",
//         variant: "danger",
//       });
//       setIsLoading(false);
//     }
//   };

//  const currentProfileImage =
//     imagePreviews.profile ||
//     (profileData.profileImageUrl
//       ? `${BACKEND_URL}${profileData.profileImageUrl}`
//       : "https://via.placeholder.com/150");

//   const currentCoverImage =
//     imagePreviews.cover ||
//     (profileData.coverImageUrl
//       ? `${BACKEND_URL}${profileData.coverImageUrl}`
//       : "https://via.placeholder.com/1000x300");

//   return (
//     <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
//       <Row>
//         <Col md={2} className="bg-white vh-100 shadow-sm p-0 sticky-top">
//           <LeftSidebar />
//         </Col>

//         <Col md={10} className="py-4 px-md-5">
//           {isLoading && !isEditing ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" />
//             </div>
//           ) : (
//             <>
//               <Card className="profile-header border-0 shadow-sm mb-5">
//                 <div style={{ position: "relative" }}>
//                   <Card.Img
//                     src={currentCoverImage}
//                     alt="Cover Photo"
//                     className="profile-cover-image"
//                   />
//                   {isEditing && (
//                     <>
//                       <input
//                         type="file"
//                         id="coverImageUpload"
//                         style={{ display: "none" }}
//                         onChange={(e) => handleImageChange(e, "cover")}
//                         accept="image/*"
//                       />
//                       <label htmlFor="coverImageUpload">
//                         <Button
//                           variant="light"
//                           size="sm"
//                           className="upload-button"
//                           as="span"
//                           style={{ top: "10px" }}
//                         >
//                           <FaCamera /> Change Cover
//                         </Button>
//                       </label>
//                     </>
//                   )}
//                 </div>
//                 <div className="profile-picture-container">
//                   <img
//                     src={currentProfileImage}
//                     alt="Profile"
//                     className="profile-picture"
//                   />
//                   {isEditing && (
//                     <>
//                       <input
//                         type="file"
//                         id="profileImageUpload"
//                         style={{ display: "none" }}
//                         onChange={(e) => handleImageChange(e, "profile")}
//                         accept="image/*"
//                       />
//                       <label htmlFor="profileImageUpload">
//                         <Button
//                           variant="light"
//                           size="sm"
//                           className="upload-button"
//                           as="span"
//                           style={{ bottom: "-10px", right: "-10px" }}
//                         >
//                           <FaCamera />
//                         </Button>
//                       </label>
//                     </>
//                   )}
//                 </div>
//               </Card>

//               <Row>
//                 <Col lg={8} className="mx-auto">
//                   <Form noValidate validated={validated} onSubmit={handleSubmit}>
//                     <Card className="shadow-sm border-0 fade-in-card">
//                       <Card.Header className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
//                         <h5 className="mb-0 fw-bold">Profile Details</h5>
//                         <Button
//                           variant={isEditing ? "outline-secondary" : "primary"}
//                           size="sm"
//                           onClick={handleEditToggle}
//                           disabled={isLoading && isEditing}
//                         >
//                           {isEditing ? (
//                             <>
//                               <FaTimes className="me-1" /> Cancel
//                             </>
//                           ) : (
//                             <>
//                               <FaEdit className="me-1" /> Edit Profile
//                             </>
//                           )}
//                         </Button>
//                       </Card.Header>

//                       <Card.Body className="p-4">
//                         {formAlert.show && (
//                           <Alert variant={formAlert.variant}>
//                             {formAlert.message}
//                           </Alert>
//                         )}

//                         <Row>
//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label className="small text-muted fw-bold">
//                                 Full Name
//                               </Form.Label>
//                               {isEditing ? (
//                                 <Form.Control
//                                   type="text"
//                                   placeholder="Enter full name"
//                                   name="name"
//                                   value={editFormData.name || ""}
//                                   onChange={handleChange}
//                                   required
//                                 />
//                               ) : (
//                                 <p className="fs-5">
//                                   {profileData.name || userData.name || "Not set"}
//                                 </p>
//                               )}
//                             </Form.Group>
//                           </Col>

//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label className="small text-muted fw-bold">
//                                 Email Address
//                               </Form.Label>
//                               <p className="fs-5 text-muted">
//                                 {userData.email || "Not set"}
//                               </p>
//                             </Form.Group>
//                           </Col>

//                           <Col xs={12}>
//                             <Form.Group className="mb-3">
//                               <Form.Label className="small text-muted fw-bold">
//                                 Biography
//                               </Form.Label>
//                               {isEditing ? (
//                                 <Form.Control
//                                   as="textarea"
//                                   rows={3}
//                                   placeholder="About me..."
//                                   name="bio"
//                                   value={editFormData.bio || ""}
//                                   onChange={handleChange}
//                                 />
//                               ) : (
//                                 <p>{profileData.bio || "Not set"}</p>
//                               )}
//                             </Form.Group>
//                           </Col>

//                           <Col xs={12}>
//                             <Form.Group className="mb-3">
//                               <Form.Label className="small text-muted fw-bold">
//                                 Location
//                               </Form.Label>
//                               {isEditing ? (
//                                 <Form.Control
//                                   type="text"
//                                   placeholder="Enter location"
//                                   name="location"
//                                   value={editFormData.location || ""}
//                                   onChange={handleChange}
//                                 />
//                               ) : (
//                                 <p>{profileData.location || "Not set"}</p>
//                               )}
//                             </Form.Group>
//                           </Col>

//                           <Col xs={12}>
//                             <Form.Group className="mb-3">
//                               <Form.Label className="small text-muted fw-bold">
//                                 Website
//                               </Form.Label>
//                               {isEditing ? (
//                                 <Form.Control
//                                   type="url"
//                                   placeholder="https://example.com"
//                                   name="website"
//                                   value={editFormData.website || ""}
//                                   onChange={handleChange}
//                                 />
//                               ) : profileData.website ? (
//                                 <a
//                                   href={profileData.website}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   {profileData.website}
//                                 </a>
//                               ) : (
//                                 <p>Not set</p>
//                               )}
//                             </Form.Group>
//                           </Col>
//                         </Row>

//                         {isEditing && (
//                           <div className="text-end mt-4">
//                             <Button
//                               variant="primary"
//                               type="submit"
//                               disabled={isLoading}
//                             >
//                               {isLoading ? (
//                                 <>
//                                   <Spinner
//                                     as="span"
//                                     animation="border"
//                                     size="sm"
//                                     className="me-2"
//                                   />
//                                   Saving...
//                                 </>
//                               ) : (
//                                 "Save Changes"
//                               )}
//                             </Button>
//                           </div>
//                         )}
//                       </Card.Body>
//                     </Card>
//                   </Form>
//                 </Col>
//               </Row>
//             </>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  FloatingLabel // Added FloatingLabel for consistency if needed, though not strictly required by current form structure
} from "react-bootstrap";
import LeftSidebar from "./LeftSidebar";
import BottomNavbar from "./BottomNavbar"; // Import mobile bottom navbar
import "../stylesheets/ProfilePage.css";
import "../stylesheets/ResponsiveNavbar.css"; // Import responsive CSS file
import { FaEdit, FaCamera, FaTimes } from "react-icons/fa";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Best practice to use environment variables
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [formAlert, setFormAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [userData, setUserData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({
    profileImageFile: null,
    coverImageFile: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    profile: null,
    cover: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileResponse.data.profile) {
            setProfileData(profileResponse.data.profile);
        }

        const userResponse = await api.get("/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse.data.user) {
            setUserData(userResponse.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setFormAlert({ show: true, message: "Could not load profile information.", variant: "danger" });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfileData();
    } else {
        setIsLoading(false);
    }
  }, [token]);

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditFormData({ ...userData, ...profileData });
      setValidated(false);
      setImagePreviews({ profile: null, cover: null });
      setSelectedFiles({ profileImageFile: null, coverImageFile: null });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (imageType === "profile") {
      setSelectedFiles((prev) => ({ ...prev, profileImageFile: file }));
    } else {
      setSelectedFiles((prev) => ({ ...prev, coverImageFile: file }));
    }

    setImagePreviews((prev) => ({
      ...prev,
      [imageType]: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);

    const formDataToUpload = new FormData();
    formDataToUpload.append("name", editFormData.name);
    formDataToUpload.append("bio", editFormData.bio);
    formDataToUpload.append("location", editFormData.location);
    // formDataToUpload.append("website", editFormData.website);

    if (selectedFiles.profileImageFile) {
      formDataToUpload.append("profileImage", selectedFiles.profileImageFile);
    }
    if (selectedFiles.coverImageFile) {
      formDataToUpload.append("coverImage", selectedFiles.coverImageFile);
    }

    try {
      const response = await api.put("/profile", formDataToUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update state with new data from response
      setProfileData(response.data.profile);
      setUserData(response.data.user);

      setIsLoading(false);
      setIsEditing(false);
      setFormAlert({
        show: true,
        message: "Profile updated successfully!",
        variant: "success",
      });
      toast.success("Profile updated successfully!");
      setTimeout(
        () => setFormAlert((prev) => ({ ...prev, show: false })),
        3000
      );
    } catch (error) {
      console.error(error);
      setFormAlert({
        show: true,
        message: "Failed to update profile.",
        variant: "danger",
      });
      setIsLoading(false);
    }
  };

  // Construct image URLs safely, checking for full URLs vs relative paths
  const constructImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${BACKEND_URL}${url}`;
  }

  const currentProfileImage =
    imagePreviews.profile ||
    constructImageUrl(profileData.profileImageUrl) ||
    "https://via.placeholder.com/150";

  const currentCoverImage =
    imagePreviews.cover ||
    constructImageUrl(profileData.coverImageUrl) ||
    "https://via.placeholder.com/1000x300";

  return (
    <Container fluid style={{ backgroundColor: "#f8f9fa" }}>
      <Row>
        {/* --- Sidebar Column (Desktop Only) --- */}
        <Col md={2} className="desktop-sidebar bg-white vh-100 shadow-sm p-0 sticky-top">
          <LeftSidebar />
        </Col>

        {/* --- Main Content Column --- */}
        <Col md={10} className="main-content-area py-4 px-md-5">
          {isLoading && !isEditing ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              {/* Profile Header Card */}
              <Card className="profile-header border-0 shadow-sm mb-5">
                <div style={{ position: "relative" }}>
                  <Card.Img
                    src={currentCoverImage}
                    alt="Cover Photo"
                    className="profile-cover-image"
                  />
                  {isEditing && (
                    <>
                      <input type="file" id="coverImageUpload" style={{ display: "none" }} onChange={(e) => handleImageChange(e, "cover")} accept="image/*" />
                      <label htmlFor="coverImageUpload">
                        <Button variant="light" size="sm" className="upload-button" as="span" style={{ top: "10px" }}>
                          <FaCamera /> Change Cover
                        </Button>
                      </label>
                    </>
                  )}
                </div>
                <div className="profile-picture-container">
                  <img src={currentProfileImage} alt="Profile" className="profile-picture" />
                  {isEditing && (
                    <>
                      <input type="file" id="profileImageUpload" style={{ display: "none" }} onChange={(e) => handleImageChange(e, "profile")} accept="image/*" />
                      <label htmlFor="profileImageUpload">
                        <Button variant="light" size="sm" className="upload-button" as="span" style={{ bottom: "-10px", right: "-10px" }}>
                          <FaCamera />
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </Card>

              {/* Profile Details Form Card */}
              <Row>
                <Col lg={8} className="mx-auto">
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Card className="shadow-sm border-0 fade-in-card">
                      <Card.Header className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">Profile Details</h5>
                        <Button
                          variant={isEditing ? "outline-secondary" : "primary"}
                          size="sm"
                          onClick={handleEditToggle}
                          disabled={isLoading && isEditing}
                        >
                          {isEditing ? (<><FaTimes className="me-1" /> Cancel</>) : (<><FaEdit className="me-1" /> Edit Profile</>)}
                        </Button>
                      </Card.Header>

                      <Card.Body className="p-4">
                        {formAlert.show && (<Alert variant={formAlert.variant}>{formAlert.message}</Alert>)}
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="small text-muted fw-bold">Full Name</Form.Label>
                              {isEditing ? (
                                <Form.Control type="text" placeholder="Enter full name" name="name" value={editFormData.name || ""} onChange={handleChange} required />
                              ) : (
                                <p className="fs-5">{userData.name || "Not set"}</p>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="small text-muted fw-bold">Email Address</Form.Label>
                              <p className="fs-5 text-muted">{userData.email || "Not set"}</p>                            
                            </Form.Group>
                          </Col>
                          <Col xs={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="small text-muted fw-bold">Biography</Form.Label>
                              {isEditing ? (
                                <Form.Control as="textarea" rows={3} placeholder="About me..." name="bio" value={editFormData.bio || ""} onChange={handleChange} />
                              ) : (
                                <p>{profileData.bio || "No biography provided."}</p>
                              )}
                            </Form.Group>
                          </Col>
                          <Col xs={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="small text-muted fw-bold">Location</Form.Label>
                              {isEditing ? (
                                <Form.Control type="text" placeholder="Enter location" name="location" value={editFormData.location || ""} onChange={handleChange} />
                              ) : (
                                <p>{profileData.location || "Not set"}</p>
                              )}
                            </Form.Group>
                          </Col>
                          {/* <Col xs={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="small text-muted fw-bold">Website</Form.Label>
                              {isEditing ? (
                                <Form.Control type="url" placeholder="https://example.com" name="website" value={editFormData.website || ""} onChange={handleChange} />
                              ) : profileData.website ? (
                                <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
              ) : (
                                <p className="text-muted">Not set</p>
                              )}
                            </Form.Group>
                          </Col> */}
                        </Row>

                        {isEditing && (
                          <div className="text-end mt-4">
                            <Button variant="primary" type="submit" disabled={isLoading}>
                              {isLoading ? (<><Spinner as="span" animation="border" size="sm" className="me-2" />Saving...</>) : ("Save Changes")}
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Form>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
      
      {/* --- Mobile Bottom Navigation --- */}
      <BottomNavbar />
    </Container>
  );
}
