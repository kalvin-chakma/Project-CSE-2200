import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./FormElement/Sidebar"; // Adjust path if necessary
import Loading from "./Loading";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true); // State to control sidebar visibility
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        "https://project-cse-2200.vercel.app/api/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching orders."
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        await axios.delete(
          `https://project-cse-2200.vercel.app/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(orders.filter((order) => order._id !== orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
        alert(
          error.response?.data?.message ||
            "An error occurred while deleting the order."
        );
        if (error.response?.status === 401) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
      }
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.put(
        `https://project-cse-2200.vercel.app/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while updating the order status."
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        {sidebarVisible && (
          <div className="w-1/5 min-w-[200px]">
            <Sidebar />
          </div>
        )}
        <div
          className={`w-${
            sidebarVisible ? "4/5" : "full"
          } flex justify-center items-center`}
        >
          <div className=" justify-center text-center items-center h-full">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        {sidebarVisible && (
          <div className="w-1/5 min-w-[200px]">
            <Sidebar />
          </div>
        )}
        <div
          className={`w-${
            sidebarVisible ? "4/5" : "full"
          } flex justify-center items-center`}
        >
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow overflow-hidden">
        {sidebarVisible && (
          <div className="w-1/5 min-w-[200px]">
            <Sidebar />
          </div>
        )}
        <div
          className={`w-${sidebarVisible ? "4/5" : "full"} overflow-y-auto p-4`}
        >
          <div className="m-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">All Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="bg-blue-500 text-white px-4 py-2">
                    <h2 className="text-xl font-semibold">
                      Order ID: {order._id}
                    </h2>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">User:</span>{" "}
                      {order.userId?.name || "N/A"} (
                      {order.userId?.email || "N/A"})
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Total Amount:</span> $
                      {order.totalAmount?.toFixed(2) || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Payment Method:</span>{" "}
                      {order.paymentMethod || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Status:</span>{" "}
                      {order.status || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Address:</span>{" "}
                      {order.address || "N/A"}
                    </p>
                    <h3 className="font-semibold mt-4 mb-2">Products:</h3>
                    <ul className="list-disc list-inside">
                      {order.products?.map((product) => (
                        <li
                          key={product._id || product.productId?._id}
                          className="text-gray-700"
                        >
                          {product.productId ? (
                            <>
                              {product.productId.title} - Quantity:{" "}
                              {product.quantity}, Price: $
                              {product.price.toFixed(2)}
                            </>
                          ) : (
                            <>
                              Product unavailable - Quantity: {product.quantity}
                              , Price: ${product.price.toFixed(2)}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-between">
                      <select
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                        value={order.status}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Payment Done">Payment Done</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                      >
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderPage;
