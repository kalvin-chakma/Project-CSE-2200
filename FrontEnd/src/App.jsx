import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Create from "./components/Create";
import Details from "./components/Details";
import LogInPage from "./components/LogInPage";
import RegisterPage from "./components/RegisterPage";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/LogInPage" element={<LogInPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </div>
  );
}
