const asyncHandler = require('../middleware/asyncHandler');
const Restaurant = require('../models/Restaurant');

// Get all restaurants
exports.getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  res.status(200).json(restaurants);
});

// Create a new restaurant
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

// Update a restaurant by ID
exports.updateRestaurant = asyncHandler(async (req, res) => {
  const { name, location, cuisine, availableSlots } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
      name,
      location,
      cuisine,
      availableSlots: availableSlots ? availableSlots.map((slot) => new Date(slot)) : [],
      image: req.file ? req.file.path : undefined,
    },
    { new: true }
  );

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  res.status(200).json(restaurant);
});

// Delete a restaurant by ID
exports.deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  res.status(200).json({ message: 'Restaurant deleted successfully' });
});

// Delete all restaurants (Optional)
exports.deleteAllRestaurants = asyncHandler(async (req, res) => {
  await Restaurant.deleteMany();
  res.status(200).json({ message: 'All restaurants deleted' });
});
