const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  availableSlots: [Date],
  ratings: { type: Number, default: 0 },
  reviews: [{ user: String, comment: String, rating: Number }],
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);