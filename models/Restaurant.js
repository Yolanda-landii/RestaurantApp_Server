const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  location: { type: String, required: [true, 'Location is required'] },
  cuisine: { type: String, required: [true, 'Cuisine is required'] },
  availableSlots: {
    type: [Date],
    validate: {
      validator: (slots) => slots.every((slot) => !isNaN(Date.parse(slot))),
      message: 'Available slots must be valid dates',
    },
  },
  image: { type: String },
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
