const Order = require('../Models/orderModel');
const CartItem = require('../Models/cartModel');
const Product = require('../Models/Product');
const User = require('../Models/user');
const mongoose = require("mongoose");

const SSLCommerzPayment = require('sslcommerz-lts');

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;


const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, address, phone } = req.body;

    const cartItems = await CartItem.find({ userId }).populate('productId');
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty", success: false });
    }

    let totalAmount = 0;
    const orderProducts = cartItems.map(item => {
      totalAmount += item.productId.price * item.quantity;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      };
    });

    const newOrder = new Order({
      userId,
      products: orderProducts,
      totalAmount,
      paymentMethod,
      address,
      phone,
      transactionId: null,
      status: paymentMethod === 'cod' ? 'Processing' : 'Pending'
    });

    await newOrder.save();

    if (paymentMethod === 'cod') {
      await CartItem.deleteMany({ userId });
    }

    res.status(201).json({ message: "Order created successfully", orderId: newOrder._id, success: true });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied", success: false });
    }
    const orders = await Order.find({ userId })
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const initiateOnlinePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, phone, paymentMethod } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const cartItems = await CartItem.find({ userId }).populate('productId');
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty", success: false });

    let totalAmount = 0;
    const orderProducts = cartItems.map(item => {
      totalAmount += item.productId.price * item.quantity;
      return { productId: item.productId._id, quantity: item.quantity, price: item.productId.price };
    });

    const transactionId = new mongoose.Types.ObjectId().toString();

    const newOrder = new Order({
      userId,
      products: orderProducts,
      totalAmount,
      paymentMethod,
      address,
      phone,
      transactionId,
      status: 'Pending',
    });

    await newOrder.save();

    const successUrl = `${process.env.BACKEND_URL}/api/orders/payment/success/${transactionId}`;
    const failUrl = `${process.env.BACKEND_URL}/api/orders/payment/fail/${transactionId}`;
    const cancelUrl = `${process.env.BACKEND_URL}/api/orders/payment/fail/${transactionId}`;
    const ipnUrl = `${process.env.BACKEND_URL}/api/orders/ipn`;

    const data = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: successUrl,
      fail_url: failUrl,
      cancel_url: cancelUrl,
      ipn_url: ipnUrl,
      shipping_method: 'Courier',
      product_name: 'Products',
      product_category: 'E-commerce',
      product_profile: 'general',
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: address,
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: phone,
      ship_name: user.name,
      ship_add1: address,
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh'
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    res.status(200).json({ url: apiResponse.GatewayPageURL });
  } catch (error) {
    console.error("Error initiating online payment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: 'userId', select: 'name email', model: User })
      .populate({ path: 'products.productId', model: Product })
      .sort({ createdAt: -1 });

    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await Order.findByIdAndDelete(orderId);
    if (!result) {
      return res.status(404).json({ message: "Order not found", success: false });
    }
    res.status(200).json({ message: "Order deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Payment Done'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status", success: false });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found", success: false });
    }

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder, success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const handlePaymentSuccess = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const order = await Order.findOne({ transactionId });
    if (!order) return res.status(404).json({ message: "Order not found", success: false });

    const valId = req.body.val_id;
    if (!valId) {
      console.error("Payment success callback missing val_id for order", transactionId);
      return res.redirect(`${process.env.FRONTEND_URL}/cartPage`);
    }

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id: valId });

    const isValid =
      validation &&
      (validation.status === 'VALID' || validation.status === 'VALIDATED') &&
      validation.tran_id === transactionId &&
      validation.currency === 'BDT' &&
      Math.abs(parseFloat(validation.amount) - order.totalAmount) < 1;

    if (!isValid) {
      console.error("Payment validation failed for order", transactionId, validation);
      return res.redirect(`${process.env.FRONTEND_URL}/cartPage`);
    }

    order.status = "Payment Done";
    await order.save();

    await CartItem.deleteMany({ userId: order.userId });

    res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const getLatestOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", success: false });
    }
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    const latestOrder = await Order.findOne({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    if (!latestOrder) {
      return res.status(404).json({ message: "No orders found for this user", success: false });
    }

    res.status(200).json({ order: latestOrder, success: true });
  } catch (error) {
    console.error("Error fetching latest order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};


const handlePaymentFail = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const order = await Order.findOne({ transactionId });

   if (order) {
      await Order.findByIdAndDelete(order._id); 
    }

    res.redirect(`${process.env.FRONTEND_URL}/cartPage`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    res.status(500).json({ message: "Internal server error", error: error.message, success: false });
  }
};

module.exports = {
  createOrder,
  initiateOnlinePayment,
  getUserOrders,
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
  handlePaymentSuccess,
  getLatestOrder,
  handlePaymentFail
};
