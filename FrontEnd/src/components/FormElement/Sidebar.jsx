import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaCreditCard,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // toggle sidebar for mobile

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    console.log("User Logged out");
    setTimeout(() => {
      navigate("/Home");
    }, 1000);
  };

  const NavItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-300 ${
          isActive ? "text-white bg-blue-600" : "text-gray-600 hover:bg-gray-100"
        }`
      }
      onClick={() => setSidebarOpen(false)} // auto-close on mobile
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-4 left-4 z-50 ">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed z-50 md:static top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col`}
      >
        <div className="p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>

        <nav className="flex-grow overflow-auto px-2 py-4">
          <NavItem to="/Dashboard" icon={<FaUser className="w-5 h-5" />}>
            My Profile
          </NavItem>

          {userRole === "admin" && (
            <>
              <NavItem to="/Create" icon={<FaBox className="w-5 h-5" />}>
                Add New Product
              </NavItem>
              <NavItem to="/AllUsers" icon={<FaUsers className="w-5 h-5" />}>
                All User Details
              </NavItem>
              <NavItem to="/AdminOrderPage" icon={<FaClipboardList className="w-5 h-5" />}>
                Admin Order Page
              </NavItem>
            </>
          )}

          {userRole === "user" && (
            <>
              <NavItem to="/CartPage" icon={<FaShoppingCart className="w-5 h-5" />}>
                My Cart
              </NavItem>
              <NavItem to="/your-orders" icon={<FaClipboardList className="w-5 h-5" />}>
                Your Order
              </NavItem>
              <NavItem to="/payment" icon={<FaCreditCard className="w-5 h-5" />}>
                Payment
              </NavItem>
            </>
          )}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-300"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
