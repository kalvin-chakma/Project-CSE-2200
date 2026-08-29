import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./FormElement/Sidebar";
import { ThreeDots } from "react-loader-spinner";
import { FaBars } from "react-icons/fa";
import API_BASE_URL from "../config/api.js";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    } else {
      setError("User not logged in");
      setLoading(false);
    }
  }, [userId]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart items");

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (e, productId, newQuantity) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ userId, productId, quantity: newQuantity }),
      });
      if (!response.ok) throw new Error("Failed to update quantity");

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const removeItem = async (e, productId) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ userId, productId }),
      });
      if (!response.ok) throw new Error("Failed to remove item");

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    navigate("/payment", { state: { items: cartItems, totalAmount } });
  };

  const renderLoader = () => (
    <div className="flex flex-col md:flex-row h-screen">
      <SidebarContainer />
      <div className="flex-1 flex items-center justify-center">
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col md:flex-row h-screen">
      <SidebarContainer />
      <div className="flex-1 flex items-center justify-center text-red-600">
        {error}
      </div>
    </div>
  );

  const SidebarContainer = () => (
    <>
      {/* Toggle Sidebar on Mobile */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 text-2xl"
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full transition-transform duration-300
          ${sidebarVisible ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 w-64 bg-white shadow-lg`}
      >
        <Sidebar />
      </div>
    </>
  );

  if (loading) return renderLoader();
  if (error) return renderError();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarContainer />

      <div className="flex-1 p-4 mt-16 md:mt-0">
        <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="border rounded-lg shadow-lg p-4 flex flex-col items-center justify-between"
              >
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.title}
                  className="w-24 h-24 object-contain mb-4"
                />
                <h2 className="text-md font-semibold text-center">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  Price: ${item.price}
                </p>

                <div className="flex items-center mb-3 space-x-2">
                  <button
                    onClick={(e) =>
                      updateQuantity(
                        e,
                        item.productId,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded-md"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={(e) =>
                      updateQuantity(e, item.productId, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded-md"
                  >
                    +
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => removeItem(e, item.productId)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
