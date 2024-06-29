import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter and rename it to Router
import Home from "./components/Home";
import Create from "./components/Create"; // Correct the import path for Create component
import Details from "./components/Details";

export default function App() {
  return (
    <Router>
      {" "}
      {/* Wrap Routes in Router */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />{" "}
        {/* Corrected path for Create component */}
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}
