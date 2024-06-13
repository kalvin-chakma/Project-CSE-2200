import React from "react";

const Navbar = () => {
  return (
    <div className="main">
      <div className="px-5 py-3 flex justify-between items-center">
        <div className="logo text-xl font-bold">WEBSITE LOGO</div>
        <div className="nav-links flex space-x-7 font-semibold opacity-75">
          <a
            href="#"
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
          <a
            href="#"
            className="nav-link text-sm font-bold text-neutral-600 hover:text-neutral-950"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
