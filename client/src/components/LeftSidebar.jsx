// src/components/LeftSidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaHome, FaUser, FaBoxOpen, FaMapMarkerAlt, FaHeart, FaCartPlus, FaDoorClosed } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const NavItem = ({ icon, text, active, onClick }) => (
  <Nav.Link
    href="#"
    active={active}
    onClick={onClick}
    className="d-flex align-items-center py-3 px-4"
  >
    {icon}
    <span className="ms-3">{text}</span>
  </Nav.Link>
);

export default function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); 

  return (
    <div className="p-3">
      <h4 className="mb-4 px-3">GadgetGrove</h4>
      <Nav variant="pills" className="flex-column">
        <NavItem
          icon={<FaHome size={18} />}
          text="Home"
          active={location.pathname === '/products'}
          onClick={() => navigate('/products')}
        />
        <NavItem
          icon={<FaUser size={18} />}
          text="Profile"
          active={location.pathname === '/profile'}
          onClick={() => navigate('/profile')}
        />
        <NavItem
          icon={<FaBoxOpen size={18} />}
          text="My Orders"
          active={location.pathname === '/orders'}
          onClick={() => navigate('/orders')}
        />
        <NavItem
          icon={<FaMapMarkerAlt size={18} />}
          text="Saved Addresses"
          active={location.pathname === '/saved-addresses'}
          onClick={() => navigate('/saved-addresses')}
        />
        <NavItem
          icon={<FaHeart size={18} />}
          text="Wishlist"
          active={location.pathname === '/wishlist'}
          onClick={() => navigate('/wishlist')}
        />
        <NavItem
          icon={<FaCartPlus size={18} />}
          text="Cart"
          active={location.pathname === '/cart'}
          onClick={() => navigate('/cart')}
        />
        <NavItem
          icon={<FaDoorClosed size={18} />}
          text="Logout"
          active={location.pathname === '/logout'}
          onClick={() => navigate('/logout')}
        />
      </Nav>
    </div>
  );
}
