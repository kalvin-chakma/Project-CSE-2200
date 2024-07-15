import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Create from "./components/Create";
import Details from "./components/Details";
import LogInPage from "./components/LogInPage";
import RegisterPage from "./components/RegisterPage";
import RefrshHandler from "./components/RefrshHandler";
import Dashboard from "./components/Dashboard";
import TokenRefresher from "./components/TokenRefresher";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://project-cse-2200.vercel.app/api/products"
      );
      if (response.ok) {
        const products = await response.json();
        const uniqueCategories = [
          ...new Set(
            products.map((product) => product.category.toLowerCase().trim())
          ),
        ];
        setCategories(uniqueCategories);
        localStorage.setItem("categories", JSON.stringify(uniqueCategories));
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const addCategory = (newCategory) => {
    const normalizedCategory = newCategory.toLowerCase().trim();
    if (!categories.includes(normalizedCategory)) {
      const updatedCategories = [...categories, normalizedCategory];
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
    }
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/LogInPage" />;
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <TokenRefresher />
      <Navbar categories={categories} />
      <Routes>
        <Route path="/" element={<Home categories={categories} />} />
        <Route path="/Home" element={<Home categories={categories} />} />
        <Route
          path="/category/:category"
          element={<Home categories={categories} />}
        />
        <Route path="/LogInPage" element={<LogInPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/create" element={<Create addCategory={addCategory} />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}
