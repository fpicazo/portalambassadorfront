import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../AuthContext"; // Import AuthContext
import logo from "../assets/logo.png"; // Ensure this points to your logo file

const Menu = () => {
  const { logout } = useContext(AuthContext); // Access the logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); 
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 object-contain" // Adjust height/width as needed
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-6 ml-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-500 px-3 py-2 text-sm font-medium"
            >
              QR Code
            </Link>
            <Link
              to="/students"
              className="text-gray-600 hover:text-blue-500 px-3 py-2 text-sm font-medium"
            >
              Students
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-500 px-3 py-2 text-sm font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
