const express = require('express');
const router = express.Router();
const OrderController = require('../Controllers/OrderController');
const { verifyToken, isAdmin } = require('../Middlewares/authMiddleware');

router.post('/create', verifyToken, OrderController.createOrder);
router.get('/user/:userId', verifyToken, OrderController.getUserOrders);
router.get('/all', verifyToken, isAdmin, OrderController.getAllOrders);
router.delete('/:orderId', verifyToken, isAdmin, OrderController.deleteOrder);
router.put('/:orderId/status', verifyToken, isAdmin, OrderController.updateOrderStatus); // New route
router.post('/initiate-online-payment', verifyToken, OrderController.initiateOnlinePayment);
router.post("/payment/success/:tran_id", OrderController.handlePaymentSuccess);
router.get("/latest/:userId", verifyToken, OrderController.getLatestOrder);
router.post("/payment/success/:tran_id", OrderController.handlePaymentSuccess);router.post("/payment/fail/:transactionId", OrderController.handlePaymentFail);


module.exports = router;