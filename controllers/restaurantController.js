const asyncHandler = require('../middleware/asyncHandler');
const Restaurant = require('../models/Restaurant');

exports.getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  res.status(200).json(restaurants);
});

exports.createRestaurant = asyncHandler(async (req, res) => {
  const { name, location, cuisine } = req.body;
  const restaurant = await Restaurant.create({
    name,
    location,
    cuisine,
    image: req.file ? req.file.path : null,
  });
  res.status(201).json(restaurant);
});

exports.updateRestaurant = asyncHandler(async (req, res) => {
  const { name, location, cuisine } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
      name,
      location,
      cuisine,
      image: req.file ? req.file.path : undefined,
    },
    { new: true }
  );
  res.status(200).json(restaurant);
});

exports.deleteRestaurant = asyncHandler(async (req, res) => {
  await Restaurant.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Restaurant deleted successfully' });
});

exports.deleteAllRestaurants = asyncHandler(async (req, res) => {
  await Restaurant.deleteMany();
  res.status(200).json({ message: 'All restaurants deleted' });
});
