const asyncHandler = require('../middleware/asyncHandler');
const Restaurant = require('../models/Restaurant');

exports.getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  res.status(200).json(restaurants);
});

exports.createRestaurant = asyncHandler(async (req, res) => {
  const { name, location, cuisine, availableSlots } = req.body;

  const restaurant = await Restaurant.create({
    name,
    location,
    cuisine,
    availableSlots: availableSlots.map((slot) => new Date(slot)),
    image: req.file ? req.file.path : null,
  });

  res.status(201).json(restaurant);
});
