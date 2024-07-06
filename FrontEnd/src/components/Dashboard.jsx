import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./FormElement/Sidebar";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const email = localStorage.getItem("userEmail");
    if (user) setLoggedInUser(user);
    if (email) {
      setUserEmail(email);
    } else {
      console.log("Email not found in localStorage");
      // You might want to fetch the email from your backend here
    }
  }, []);

  if (!loggedInUser) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/5 min-w-[200px]">
            <Sidebar />
          </div>
          <div className="w-3/5 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-3xl font-bold mb-4">Profile Information</div>
              <div className="shadow rounded-md p-4">
                <div className="mt-4">
                  <p>
                    <strong>Name:</strong>{" "}
                    <span className="text-red-600">{loggedInUser}</span>
                  </p>
                </div>
                <div className="mt-4">
                  <p>
                    <strong>Email:</strong>{" "}
                    <span className="text-red-600">
                      {userEmail || "Email not available"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
