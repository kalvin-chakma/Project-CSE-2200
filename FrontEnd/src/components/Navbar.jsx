import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    alert('User Logged out');
    setLoggedInUser('');
    setTimeout(() => {
      navigate('/LogInPage');
    }, 1000);
  };

  return (
    <div className="main">
      <div className="px-5 py-5 flex justify-between items-center shadow-xl">
        <div className="logo text-xl font-bold">WEBSITE LOGO</div>
        <div className="nav-links flex space-x-7 font-semibold opacity-75">
          <a
            href="./"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            Home
          </a>
          <a
            href="#"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            Category
          </a>
          <a
            href="#"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            About Us
          </a>
          <a
            href="#"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            Contact Us
          </a>
          {loggedInUser ? (
            <>
              <a
                href="/create"
                className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
              >
                Add New Product
              </a>
              <button
                onClick={handleLogout}
                className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/LogInPage"
              className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
            >
              Log In
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
