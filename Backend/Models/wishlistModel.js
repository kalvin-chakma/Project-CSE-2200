const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now }
});

wishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);


