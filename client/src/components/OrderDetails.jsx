import React from "react";
import { Card, Button, Form, Row, Col, Image } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
const AddressCard = ({ address, isSelected, onSelect }) => (
  
  <Card
    className={`mb-3 ${isSelected ? "border-primary shadow" : "shadow-sm"}`}
    onClick={() => onSelect(address._id)}
    style={{ cursor: "pointer" }}
  >
    <Card.Body className="d-flex align-items-center">
      <Form.Check
        type="radio"
        id={`address-${address._id}`}
        checked={isSelected}
        readOnly
        className="me-3"
      />
      <div>
        <Card.Title as="h6">{address.name}</Card.Title>
        <Card.Text className="mb-0 text-muted small">
          {address.address}, {address.city}, {address.state} - {address.postalCode},{address.country}
        </Card.Text>
        <Card.Text className="text-muted small">
          Phone: {address.phone}
        </Card.Text>
      </div>
    </Card.Body>
  </Card>
);

// Fix CartItemCard to access item.product properties
const CartItemCard = ({ item, onRemove }) => (
  <div className="d-flex align-items-center p-3 border-bottom">
    <Image
      src={`${BACKEND_URL}/${item.product.image[0]}`}
      alt={item.product.name}
      width={80}
      height={80}
      rounded
      className="me-3 object-cover"
    />
    <div className="flex-grow-1">
      <h6 className="mb-1">{item.product.name}</h6>
      <p className="text-muted small mb-1">{item.product.description}</p>
      <div className="d-flex justify-content-between align-items-center">
        <strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong>
        <span className="text-muted small">Qty: {item.quantity}</span>
      </div>
    </div>
    <Button
      variant="outline-danger"
      size="sm"
      onClick={onRemove}
      className="ms-3"
    >
      <FaTrashAlt />
    </Button>
  </div>
);

// Main OrderDetails Component
export default function OrderDetails({
  
  addresses,
  cartItems,
  selectedAddressId,
  onSelectAddress,
  onRemoveItem,
}) {
  
  return (
    <>
      {/* Section 1: Address Selection */}
      <section className="mb-5">
        <h2 className="h4 mb-4">Select Delivery Address</h2>
        <Row>
          {addresses.map((address) => (
            <Col md={6} key={address._id}>
              <AddressCard
                address={address}
                isSelected={selectedAddressId === address._id}
                onSelect={onSelectAddress}
              />
            </Col>
          ))}
        </Row>
        <Link to="/address" className="btn btn-outline-secondary mt-2">
          + Add New Address
        </Link>
      </section>

      {/* Section 2: Cart Items Review */}
      <section>
        <h2 className="h4 mb-4">Review Items ({cartItems.length})</h2>
        <Card className="shadow-sm">
          {cartItems.length > 0 ? (
            cartItems.filter(item => item.product).map((item) => (
              <CartItemCard
                key={item._id}
                item={item}
                onRemove={() => onRemoveItem(item.product._id)}
              />
            ))
          ) : (
            <Card.Body className="text-center text-muted">
              Your cart is empty.
            </Card.Body>
          )}
        </Card>
      </section>
    </>
  );
}
