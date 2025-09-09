import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FaTachometerAlt, 
    FaCube, 
    FaShoppingCart, 
    FaUsers, 
    FaSignOutAlt, 
    FaGlobe 
} from 'react-icons/fa';
import './stylesheets/AdminSidebar.css'; // New CSS file for custom admin sidebar styles

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/admin/products', text: 'Products', icon: <FaCube /> },
        { path: '/admin/orders', text: 'Orders', icon: <FaShoppingCart /> },
        { path: '/admin/customers', text: 'Customers', icon: <FaUsers /> },
    ];

    const handleLogout = () => {
        // Clear local storage/context before navigating to logout page or login page
        localStorage.removeItem('token');

        navigate('/logout');
    };

    return (
        <div className="admin-sidebar-container d-flex flex-column vh-100 p-3">
            <h4 className="text-white text-center mb-4 mt-2">Admin Panel</h4>
            
            <Nav variant="pills" className="flex-column mb-auto" activeKey={location.pathname}>
                {menuItems.map((item) => (
                    <Nav.Item key={item.path}>
                        <Nav.Link 
                            onClick={() => navigate(item.path)}
                            active={location.pathname.startsWith(item.path)}
                            className="sidebar-link d-flex align-items-center mb-2"
                        >
                            {item.icon}
                            <span className="ms-3">{item.text}</span>
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            {/* --- Bottom Links --- */}
            <div className="mt-auto">
                 <Nav className="flex-column">
                     <Nav.Link onClick={() => navigate('/')} className="sidebar-link sidebar-link-bottom d-flex align-items-center small">
                        <FaGlobe className="me-2" /> Back to Website
                    </Nav.Link>
                    <Nav.Link onClick={handleLogout} className="sidebar-link sidebar-link-bottom d-flex align-items-center small text-danger">
                        <FaSignOutAlt className="me-2" /> Logout
                    </Nav.Link>
                 </Nav>
            </div>
        </div>
    );
}

export default AdminSidebar;