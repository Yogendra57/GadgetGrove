// // import React from 'react';
// // import { Card, Image } from 'react-bootstrap';
// // import { FaStar, FaUserCircle } from 'react-icons/fa';

// // const StarRatingDisplay = ({ rating }) => {
// //   return (
// //     <div>
// //       {[...Array(5)].map((star, index) => (
// //         <FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
// //       ))}
// //     </div>
// //   );
// // };

// // const ReviewList = ({ reviews }) => {
// //   if (!reviews || reviews.length === 0) {
// //     return <p>No reviews yet. Be the first to review this product!</p>;
// //   }
// // const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// //   return (
// //     <div className="review-list">
// //       {reviews.map((review) => {
// //         // --- FIX: Move this line inside the .map() loop ---
// //         const reviewerName = review.user?.name || review.name || 'Anonymous User';

// //         return (
// //           // Use review._id if available, otherwise a fallback key for newly created reviews without an ID yet
// //           <Card key={review._id || Math.random()} className="mb-3 review-card border-0 shadow-sm">
// //             <Card.Body>
// //               <div className="d-flex align-items-center mb-2">
// //                 <FaUserCircle size={30} className="me-2 text-muted" />
// //                 <div>
// //                   <h6 className="mb-0 fw-bold">{reviewerName}</h6>
// //                   {review.createdAt && (
// //                     <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
// //                   )}
// //                 </div>
// //               </div>
// //               <StarRatingDisplay rating={review.rating} />
// //               <Card.Text className="mt-2">{review.comment}</Card.Text>
// //               {review.image && (
// //                 <Image
// //                   src={`${BASE_URL}/${review.image}`}
// //                   alt="Review"
// //                   thumbnail
// //                   className="review-image mt-2"
// //                   style={{ height: '100px', cursor: 'pointer' }}
// //                   onClick={() => window.open(review.image, '_blank')}
// //                 />
// //               )}
// //             </Card.Body>
// //           </Card>
// //         );
// //       })}
// //     </div>
// //   );
// // };

// // export default ReviewList;





// // src/components/ReviewList.jsx

// import React, { useState } from 'react';
// import { Card, Image, Button, Badge } from 'react-bootstrap';
// import { FaStar, FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
// import { useSelector } from 'react-redux';
// import api from '../utils/api';
// import EditReviewForm from './EditReviewForm'; // We will create this component next

// const StarRatingDisplay = ({ rating }) => {
//   return (
//     <div>
//       {[...Array(5)].map((star, index) => (
//         <FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
//       ))}
//     </div>
//   );
// };

// const ReviewList = ({ reviews, productId, onReviewUpdate }) => {
//   const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
//   if (!reviews || reviews.length === 0) {
//     return <p>No reviews yet. Be the first to review this product!</p>;
//   }
//   // Get logged-in user details from Redux state to compare IDs
//   const loggedInUser = useSelector((state) => state.auth.user); // Adjust based on your auth state structure
//   const token = localStorage.getItem('token');

//   const [editingReviewId, setEditingReviewId] = useState(null);

//   const handleDeleteReview = async (reviewId) => {
//     if (window.confirm("Are you sure you want to delete this review?")) {
//       try {
//         await api.delete(`/products/${productId}/reviews/${reviewId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         onReviewUpdate(); // Notify parent component to refresh reviews
//       } catch (error) {
//         console.error("Failed to delete review:", error);
//         alert("Failed to delete review.");
//       }
//     }
//   };

//   return (
//     <div className="review-list">
//       {reviews.map((review) => {
//         const reviewerName = review.user?.name || review.name || 'Anonymous User';
//         const canEdit = loggedInUser && loggedInUser._id === review.user._id;

//         return (
//           <Card key={review._id} className="mb-3 review-card shadow-sm">
//             <Card.Body>
//               {editingReviewId === review._id ? (
//                 // --- EDITING VIEW ---
//                 <EditReviewForm
//                   review={review}
//                   productId={productId}
//                   onCancel={() => setEditingReviewId(null)}
//                   onSuccess={() => {
//                     setEditingReviewId(null);
//                     onReviewUpdate(); // Refresh reviews list
//                   }}
//                 />
//               ) : (
//                 // --- DISPLAY VIEW ---
//                 <>
//                   <div className="d-flex justify-content-between align-items-start">
//                     <div className="d-flex mb-2">
//                       <FaUserCircle size={30} className="me-2 text-muted" />
//                       <div>
//                         <h6 className="mb-0 fw-bold">{reviewerName}</h6>
//                         <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
//                       </div>
//                     </div>
//                     {canEdit && (
//                       <div className="review-actions">
//                         <Button variant="link" size="sm" className="text-primary p-0 me-2" onClick={() => setEditingReviewId(review._id)}>
//                           <FaEdit /> Edit
//                         </Button>
//                         <Button variant="link" size="sm" className="text-danger p-0" onClick={() => handleDeleteReview(review._id)}>
//                           <FaTrash /> Delete
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                   <StarRatingDisplay rating={review.rating} />
//                   <Card.Text className="mt-2 mb-0">{review.comment}</Card.Text>
//                   {review.image && (
//                     <Image src={`${BACKEND_URL}/${review.image}`} alt="Review" thumbnail className="review-image mt-2" style={{ height: '100px' }} />
//                   )}
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

// export default ReviewList;






// src/components/ReviewList.jsx

import React, { useState } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { FaStar, FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import EditReviewForm from './EditReviewForm'; // Import the edit form
import { toast } from 'react-toastify';

// Helper component for star display
const StarRatingDisplay = ({ rating }) => {
  return (
    <div>
      {[...Array(5)].map((star, index) => (
        <FaStar key={index} color={index < rating ? "#ffc107" : "#e4e5e9"} />
      ))}
    </div>
  );
};

const ReviewList = ({ reviews, productId, onReviewUpdate }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  let loggedInUser = useSelector((state) => state.auth?.user);
   if (!loggedInUser) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      loggedInUser = JSON.parse(storedUser);
    }
  }
  const token = localStorage.getItem('token');
  const [editingReviewId, setEditingReviewId] = useState(null);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await api.delete(`/reviews/${productId}/reviews/${reviewId}`, {///:productId/reviews/:reviewId
          headers: { Authorization: `Bearer ${token}` },
        });
        onReviewUpdate(); // Notify parent component to refresh reviews state
      } catch (error) {
        console.error("Failed to delete review:", error);
        toast.error("Failed to delete review.");
      }
    }
  };

  return (
    <div className="review-list">
      {reviews.length === 0 && <p>No reviews yet. Be the first to review this product!</p>}
      {reviews.map((review, index) => {
        // Robust check for ownership (handles populated user object vs. string ID)
        const reviewAuthorId = typeof review.user === 'object' ? review.user._id : review.user;
        const currentUserId = loggedInUser?._id;
        const canEdit = currentUserId && currentUserId === reviewAuthorId;
      

        return (
          <Card key={review._id} className="mb-3 review-card shadow-sm">
            <Card.Body>
              {editingReviewId === review._id ? (
                // --- EDITING VIEW ---
                <EditReviewForm
                  review={review}
                  productId={productId}
                  onCancel={() => setEditingReviewId(null)}
                  onSuccess={() => {
                    setEditingReviewId(null);
                    onReviewUpdate(); // Refresh reviews list
                  }}
                />
              ) : (
                // --- DISPLAY VIEW ---
                <>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex mb-2">
                      <FaUserCircle size={30} className="me-2 text-muted" />
                      <div>
                        <h6 className="mb-0 fw-bold">{review.name || "User"}</h6>
                        <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="review-actions">
                        <Button variant="link" size="sm" className="text-primary p-0 me-2" onClick={() => setEditingReviewId(review._id)}>
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="link" size="sm" className="text-danger p-0" onClick={() => handleDeleteReview(review._id)}>
                          <FaTrash /> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  <StarRatingDisplay rating={review.rating} />
                  <Card.Text className="mt-2 mb-0">{review.comment}</Card.Text>
                  {review.image && (
                    <Image src={`${BACKEND_URL}/${review.image}`} alt="Review" thumbnail className="review-image mt-2" style={{ height: '100px' }} />
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default ReviewList;