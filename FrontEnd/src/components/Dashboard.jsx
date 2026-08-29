import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./FormElement/Sidebar";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import API_BASE_URL from "../config/api.js";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const { name, email, role } = data.user;
          setLoggedInUser(name);
          setUserEmail(email);
          setUserRole(role);
          localStorage.setItem("loggedInUser", name);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", role);
        } else {
          console.error("Failed to fetch user data");
          navigate("/LogInPage");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        navigate("/LogInPage");
      }
    };

    const user = localStorage.getItem("loggedInUser");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (user && email && role) {
      setLoggedInUser(user);
      setUserEmail(email);
      setUserRole(role);
    } else {
      fetchUserData();
    }
  }, [navigate]);

  if (!loggedInUser) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-grow overflow-hidden">
          <div className=" min-w-[200px]">
            <Sidebar />
          </div>
          <div className="w-2/3 p-4 mx-auto">
            <div className="max-w-2xl ">
              {userRole === "admin" ? (
                <AdminDashboard
                  loggedInUser={loggedInUser}
                  userEmail={userEmail}
                />
              ) : (
                <UserDashboard
                  loggedInUser={loggedInUser}
                  userEmail={userEmail}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
