// index.js
const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./Models/db"); 

const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Connect to MongoDB
connectDB();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Routes
const AuthRouter = require("./Routes/AuthRouter");
const UserRouter = require('./Routes/UserRouter');
const products = require("./Routes/products");
const cartRoutes = require('./Routes/cartRoutes');
const AdminRouter = require('./Routes/AdminRouter');
const OrderRoutes = require('./Routes/OrderRoutes');
const WishlistRoutes = require('./Routes/wishlistRoutes');

app.use("/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/products", products);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", AdminRouter);
app.use("/api/orders", OrderRoutes);
app.use("/api/wishlist", WishlistRoutes);

app.get("/ping", (req, res) => res.send("PONG"));
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform
  });
});
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    success: false,
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

process.on('uncaughtException', (err) => {
  console.error(' Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
  module.exports = app; 
} else {
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });
}
