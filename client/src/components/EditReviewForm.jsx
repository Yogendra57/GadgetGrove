// // src/components/EditReviewForm.jsx

// import React, { useState } from 'react';
// import { Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { FaStar } from 'react-icons/fa';
// import api from '../utils/api';

// // Reusable Star Rating Input Component
// const StarRatingInput = ({ rating, setRating }) => {
//   const [hover, setHover] = useState(0);
//   return (
//     <div className="star-rating-input mb-3">
//       {[...Array(5)].map((star, index) => {
//         const ratingValue = index + 1;
//         return (
//           <label key={index}>
//             <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} style={{ display: 'none' }} />
//             <FaStar
//               className="star"
//               color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
//               size={25}
//               onMouseEnter={() => setHover(ratingValue)}
//               onMouseLeave={() => setHover(0)}
//               style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
//             />
//           </label>
//         );
//       })}
//     </div>
//   );
// };

// const EditReviewForm = ({ review, productId, onCancel, onSuccess }) => {
//   const [rating, setRating] = useState(review.rating);
//   const [comment, setComment] = useState(review.comment);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const token = localStorage.getItem('token');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       await api.put(`/products/${productId}/reviews/${review._id}`, 
//         { rating, comment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       onSuccess(); // Trigger parent component refresh/closure
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update review.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {error && <Alert variant="danger" size="sm">{error}</Alert>}
//       <Form.Group className="mb-2">
//         <Form.Label className="small fw-bold">Update Your Rating:</Form.Label>
//         <StarRatingInput rating={rating} setRating={setRating} />
//       </Form.Group>
//       <Form.Group className="mb-3">
//         <Form.Label className="small fw-bold">Update Your Comment:</Form.Label>
//         <Form.Control
//           as="textarea"
//           rows={3}
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           required
//         />
//       </Form.Group>
//       <div>
//         <Button variant="primary" type="submit" size="sm" disabled={loading} className="me-2">
//           {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
//         </Button>
//         <Button variant="outline-secondary" size="sm" onClick={onCancel}>
//           Cancel
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default EditReviewForm;





// src/components/EditReviewForm.jsx

import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

// Reusable Star Rating Input Component
const StarRatingInput = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating-input mb-3">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} style={{ display: 'none' }} />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={25}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
            />
          </label>
        );
      })}
    </div>
  );
};

const EditReviewForm = ({ review, productId, onCancel, onSuccess }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put(`/reviews/${productId}/reviews/${review._id}`, 
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess(); // Trigger parent component refresh/closure
        toast.success("Review updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update review.");
      toast.error("Failed to update review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" size="sm">{error}</Alert>}
      <Form.Group className="mb-2">
        <Form.Label className="small fw-bold">Update Your Rating:</Form.Label>
        <StarRatingInput rating={rating} setRating={setRating} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="small fw-bold">Update Your Comment:</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </Form.Group>
      <div>
        <Button variant="primary" type="submit" size="sm" disabled={loading} className="me-2">
          {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditReviewForm;