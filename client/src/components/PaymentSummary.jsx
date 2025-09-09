// src/components/PaymentSummary.jsx
import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';

const PriceRow = ({ label, value, bold = false }) => (
  <ListGroup.Item className={`d-flex justify-content-between align-items-center border-0 px-0 ${bold ? 'fw-bold h5' : ''}`}>
    <span>{label}</span>
    <span>{value}</span>
  </ListGroup.Item>
);

export default function PaymentSummary({ subtotal, shippingFee, taxes, total, onPlaceOrder, disabled }) {
  return (
    <Card className="border-0">
      <Card.Body>
        <h3 className="h5 mb-4 border-bottom pb-2">Order Summary</h3>
        <ListGroup variant="flush">
          <PriceRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
          <PriceRow label="Shipping Fee" value={shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`} />
          <PriceRow label="Taxes" value={`₹${taxes.toFixed(2)}`} />
          <PriceRow label="Total Amount" value={`₹${total.toFixed(2)}`} bold={true} />
        </ListGroup>
        <Button
          variant="primary"
          size="lg"
          className="w-100 mt-4"
          onClick={onPlaceOrder}
          disabled={disabled}
        >
          Place Order
        </Button>
        <p className="text-muted small text-center mt-3">
          By placing your order, you agree to our terms and conditions.
        </p>
      </Card.Body>
    </Card>
  );
}