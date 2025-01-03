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

exports.updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const restaurant = await Restaurant.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.json(restaurant);
});

exports.deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findByIdAndDelete(id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.json({ message: 'Restaurant deleted successfully' });
});
