import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { Create } from "./components/Create";
import Details from "./components/Details";
import { RootLayout } from "./layouts/root-layout";

export default function App() {
  return (
    <Routes>
      <Route
        element={<RootLayout />}
        children={[
          <Route path="/" element={<Home />} />,
          <Route path="/create" element={<Create />} />,
          <Route path="/create-1" element={<Create />} />,
          <Route path="/details/:id" element={<Details />} />,
        ]}
      ></Route>
    </Routes>
  );
}
