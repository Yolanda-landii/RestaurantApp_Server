const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  availableSlots: [Date],
  image: { type: String },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
