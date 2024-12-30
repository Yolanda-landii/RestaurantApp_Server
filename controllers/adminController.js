const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

exports.getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.json(restaurants);
});