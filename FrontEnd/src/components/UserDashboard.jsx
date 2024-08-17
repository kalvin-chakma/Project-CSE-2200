import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";

const UserDashboard = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://project-cse-2200-xi.vercel.app/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-400px h-900px p-4">
      <div className="text-2xl text-center md:text-3xl font-bold mb-4">
        User Dashboard
      </div>
      <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-4">
        <div className="mt-4">
          <p>
            <strong>Name:</strong>{" "}
            <span className="text-red-600">
              {userData.name || "Name not available"}
            </span>
          </p>
        </div>
        <div className="mt-4">
          <p>
            <strong>Email:</strong>{" "}
            <span className="text-red-600">
              {userData.email || "Email not available"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
