const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./Models/db"); // Initialize MongoDB connection

// Connect to database
connectDB();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Import routers
const AuthRouter = require("./Routes/AuthRouter");
const products = require("./Routes/products");
const cartRoutes = require('./Routes/cartRoutes');
const AdminRouter = require('./Routes/AdminRouter');
const OrderRoutes = require('./Routes/OrderRoutes');
const UserRouter = require('./Routes/UserRouter');
const WishlistRoutes = require('./Routes/wishlistRoutes');



// Health check routes
app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse application/json requests
// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication routes
app.use("/auth", AuthRouter);

// Products routes
app.use("/api/user", UserRouter);
app.use("/api/products", products);
app.use('/api/cart', cartRoutes);
app.use('/api/admin',  AdminRouter);
app.use('/api/orders', OrderRoutes); 
app.use('/api/wishlist', WishlistRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    success: false,
    path: req.originalUrl
  });
});

// Error handling middleware (must be placed after all routes/middleware)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 8080;

// For Vercel deployment, we need to export the app
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
