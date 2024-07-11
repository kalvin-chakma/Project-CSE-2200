import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import WebsiteLogo from "../assets/Logo.png";

const Navbar = ({ categories }) => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");
    setLoggedInUser(user);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    alert("User Logged out");
    setLoggedInUser("");
    setUserRole("");
    setShowProfileDropdown(false);
    setTimeout(() => {
      navigate("/Home");
    }, 1000);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowCategoryDropdown(false);
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowProfileDropdown(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    setShowCategoryDropdown(false);
  };
  return (
    <div className="main">
      <div className="px-5 py-2 flex justify-between items-center shadow-xl">
        <div className="logo text-xl font-bold">
          <img
            src={WebsiteLogo}
            alt="Website_Logo"
            className="object-fit rounded-xl"
            style={{ width: "100px", height: "50px" }}
          />
        </div>
        <div className="nav-links flex space-x-7 font-semibold opacity-75">
          <Link
            to="/"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            Home
          </Link>
          <div className="relative">
            <button
              onClick={toggleCategoryDropdown}
              className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
            >
              Category
            </button>
            {showCategoryDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            to="#"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            About Us
          </Link>
          <Link
            to="#"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            Contact Us
          </Link>
          {loggedInUser ? (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
              >
                Profile
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/Dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  {userRole === "admin" ? (
                    <Link
                      to="/create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add New Product
                    </Link>
                  ) : (
                    <Link
                      to="/cart"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Cart
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/LogInPage"
              className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
