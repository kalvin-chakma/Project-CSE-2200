const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const WishlistItem = require('../Models/wishlistModel');
const Product = require('../Models/Product');
const { verifyToken } = require('../Middlewares/authMiddleware');

// Get wishlist for authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await WishlistItem.find({ userId: req.user.id })
      .populate('productId');
    const formatted = items.map(it => ({
      _id: it._id,
      product: it.productId,
      addedAt: it.createdAt,
    }));
    res.json({ items: formatted, success: true });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist', success: false });
  }
});

// Add product to wishlist
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'productId required', success: false });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId', success: false });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({ userId: req.user.id, productId });
    if (existingItem) {
      return res.status(200).json({ message: 'Product already in wishlist', item: existingItem, success: true });
    }

    const doc = await WishlistItem.create({ userId: req.user.id, productId });
    res.status(201).json({ message: 'Added to wishlist', item: doc, success: true });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist', success: false });
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId', success: false });
    }
    
    const deletedItem = await WishlistItem.findOneAndDelete({ userId: req.user.id, productId });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found in wishlist', success: false });
    }
    
    res.json({ message: 'Removed from wishlist', success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist', success: false });
  }
});

module.exports = router;


