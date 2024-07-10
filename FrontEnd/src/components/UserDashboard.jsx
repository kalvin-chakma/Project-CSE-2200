import React from "react";

const UserDashboard = ({ loggedInUser, userEmail }) => {
  return (
    <div>
      <div className="text-3xl font-bold mb-4">User Dashboard</div>
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
            <span className="text-red-600">{userEmail || "Email not available"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
