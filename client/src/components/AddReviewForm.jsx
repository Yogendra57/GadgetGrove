// src/components/AddReviewForm.jsx

import React, { useState } from 'react';
import { Form, Button, FloatingLabel, Alert } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

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
              size={30}
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

const AddReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (rating === 0) {
      toast.error("Please select a rating.");
      setError("Please select a rating.");
      return;
    }

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    if (imageFile) {
      formData.append('image', imageFile); // 'image' should match backend middleware field name
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/reviews/${productId}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      setSuccess("Review submitted successfully!");
      toast.success("Review submitted successfully!");
      onReviewSubmitted(res.data.review); // Pass new review back to parent component
      setRating(0);
      setComment("");
      setImageFile(null);
      if(res.data.message){
        alert(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
      toast.error("Failed to submit review.");
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Your Rating:</Form.Label>
        <StarRatingInput rating={rating} setRating={setRating} />
      </Form.Group>

      <FloatingLabel controlId="floatingComment" label="Your Review" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: '120px' }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </FloatingLabel>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload Image (Optional)</Form.Label>
        <Form.Control type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">Submit Review</Button>
    </Form>
  );
};

export default AddReviewForm;