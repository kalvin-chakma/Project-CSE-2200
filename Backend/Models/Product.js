const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
  sizes: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        const allowed = ['s', 'm', 'xl', 'xxl'];
        return Array.isArray(arr) && arr.every(v => allowed.includes(String(v).toLowerCase()));
      },
      message: 'Sizes must be any of s, m, xl, xxl'
    }
  },
  description: { type: String, required: true },
  image: { type: String, required: true },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", ProductSchema);
