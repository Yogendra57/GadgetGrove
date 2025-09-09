import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaHome, FaUser, FaBoxOpen, FaHeart, FaCartPlus, FaLocationArrow, FaDoorClosed } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../stylesheets/ResponsiveNavbar.css'; // We will create this CSS file

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/products', icon: <FaHome size={20} />, label: 'Home' },
    { path: '/orders', icon: <FaBoxOpen size={20} />, label: 'Orders' },
    { path: '/wishlist', icon: <FaHeart size={20} />, label: 'Wishlist' },
    { path: '/cart', icon: <FaCartPlus size={20} />, label: 'Cart' },
    { path: '/saved-addresses', icon: <FaLocationArrow size={20} />, label: 'Addresses' },
    { path: '/profile', icon: <FaUser size={20} />, label: 'Profile' },
    { path: '/logout', icon: <FaDoorClosed size={20} />, label: 'Logout' }
  ];

  return (
    <nav className="mobile-bottom-navbar">
      <Nav className="w-100 justify-content-around">
        {navItems.map((item) => (
          <Nav.Link
            key={item.path}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            className="d-flex flex-column align-items-center p-2"
          >
            {item.icon}
            <span className="bottom-nav-label">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>
    </nav>
  );
};

export default BottomNavbar;