// src/components/admin/AdminBottomNavbar.jsx

import React from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaCube, FaShoppingCart, FaUsers, FaSignOutAlt, FaHome } from 'react-icons/fa';
import '../stylesheets/ResponsiveNavbar.css'; 

const AdminBottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminNavItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FaCube size={20} />, label: 'Products' },
    { path: '/admin/orders', icon: <FaShoppingCart size={20} />, label: 'Orders' },
    { path: '/admin/customers', icon: <FaUsers size={20} />, label: 'Customers' },
    {path:'/products',icon:<FaHome size={20}/>,label:'Shop'},
    {path:'/logout',icon:<FaSignOutAlt size={20}/>,label:'Logout'}
    
    
  ];

  return (
    <nav className="mobile-bottom-navbar admin-bottom-navbar"> {/* Use mobile-bottom-navbar class to enable responsive behavior */}
      <Nav className="w-100 justify-content-around">
        {adminNavItems.map((item) => (
          <Nav.Link
            key={item.path}
            active={location.pathname.startsWith(item.path)}
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

export default AdminBottomNavbar;