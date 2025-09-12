import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./FormElement/Sidebar";
import API_BASE_URL from "../config/api.js";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

   const handlePhoneChange = (e) => setPhone(e.target.value);

  const handlePayment = async () => {
    if (!address.trim() || !phone.trim()) {
      setError("Please enter a valid address and phone number.");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (paymentMethod === "cod") {
        const response = await axios.post(
          `${API_BASE_URL}/api/orders/create`,
          { userId, paymentMethod, address, phone },
          { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
        );

        if (response.data.success) {
          navigate("/payment-success", { state: { orderId: response.data.orderId } });
        } else {
          setError("Failed to create order. Please try again.");
        }
      } else if (paymentMethod === "online") {
        const response = await axios.post( 
          `${API_BASE_URL}/api/orders/initiate-online-payment`,
          { userId, paymentMethod, address, phone },
          { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
        );

        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          setError("Online payment initiation failed. Please try again.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="flex w-full h-screen font-sans">
      
      <Sidebar />

      {/* Payment Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-auto p-6">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Payment Details</h1>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Address:</label>
            <textarea
              value={address}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your full address"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone Number:</label>
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">Choose a Payment Method:</p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Online Payment</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4 text-center bg-red-100 p-2 rounded-lg">{error}</p>}

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || !address.trim() || !phone.trim() || isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;