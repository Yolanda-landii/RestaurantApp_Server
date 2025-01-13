const asyncHandler = require('../middleware/asyncHandler');
const Restaurant = require('../models/Restaurant');

// Get all restaurants
exports.getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  res.status(200).json(restaurants);
});

// // Create a new restaurant

exports.createRestaurant = asyncHandler(async (req, res) => {
  try {
    // Normalize `availableSlots` to ensure it is always an array of Date objects
    const slots = Array.isArray(req.body.availableSlots)
      ? req.body.availableSlots.map((slot) => new Date(slot))
      : [new Date(req.body.availableSlots)];

    // Prepare the restaurant data
    const restaurantData = {
      ...req.body,
      availableSlots: slots,
    };

    // Add `image` field if it exists in the request (assuming file upload is handled)
    if (req.file) {
      restaurantData.image = req.file.path;
    }

    // Create the restaurant document
    const restaurant = await Restaurant.create(restaurantData);

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error in createRestaurant:', error.message);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
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
