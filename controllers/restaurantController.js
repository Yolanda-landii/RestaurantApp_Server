const asyncHandler = require('../middleware/asyncHandler');
const Restaurant = require('../models/Restaurant');

exports.getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.json(restaurants);
});

exports.createRestaurant = asyncHandler(async (req, res) => {
  const { name, location, cuisine, availableSlots } = req.body;
  const restaurant = await Restaurant.create({
    name,
    location,
    cuisine,
    availableSlots,
  });
  res.status(201).json(restaurant);
});