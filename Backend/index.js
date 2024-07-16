const express = require("express");
const app = express();
require("dotenv").config();
require("./Models/db"); // Initialize MongoDB connection
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routers
const AuthRouter = require("./Routes/AuthRouter");
const ProductsRouter = require("./Routes/products");

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse application/json requests

// Routes
app.get("/ping", (req, res) => {
  res.send("PONG");
});

// Authentication routes
app.use("/auth", AuthRouter);

// Products routes
app.use("/api/products", ProductsRouter);

// Error handling middleware (must be placed after all routes/middleware)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
