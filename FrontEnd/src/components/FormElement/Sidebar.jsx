import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/Home"); // Redirect to "/Home" after logout
    }, 1000);
  };

  const handleSuccess = (message) => {
    // Implement your success message handling here
    console.log(message);
  };

  return (
    <div className="max-w-400px mx-auto h-900px">
      <div className="h-screen flex flex-col border-r-2 border-gray-400">
        <div className="flex-grow">
          <div className="py-4 px-6 font-bold text-xl ml-10">Dashboard</div>
          <div className="w-10/12 h-0.5 bg-gray-400 mx-auto"></div>
          <div className="py-4 px-6">
            <NavLink
              to="/Dashboard"
              className="block px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              activeClassName="block px-4 py-2 text-sm rounded-md text-white bg-gray-700"
            >
              My Profile
            </NavLink>
          </div>
          <div className="py-4 px-6">
            <NavLink
              to="/create"
              className="block px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              activeClassName="block px-4 py-2 text-sm rounded-md text-white bg-gray-700"
            >
              Add New Product
            </NavLink>
          </div>
          <div className="py-4 px-6">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
