const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');
const Restaurant = require('../models/Restaurant');

exports.createRestaurant = asyncHandler(async (req, res) => {
  const { name, location, cuisine } = req.body;
  let imageUrl = null;

  try {
    // If an image file is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'restaurants',
      });
      imageUrl = result.secure_url;
    }

    // Create the restaurant document in the database
    const restaurant = await Restaurant.create({
      name,
      location,
      cuisine,
      image: imageUrl,
      adminId: (req.user._id)

    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Failed to create restaurant', error: error.message });
  }
});

exports.updateRestaurant = asyncHandler(async (req, res) => {
  const { name, location, cuisine } = req.body;
  let imageUrl;

  try {
    // If an image file is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'restaurants',
      });
      imageUrl = result.secure_url;
    }

    // Update the restaurant in the database
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        name,
        location,
        cuisine,
        image: imageUrl || undefined,
      },
      { new: true }
    );

    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Failed to update restaurant', error: error.message });
  }
});

exports.getAllRestaurants = asyncHandler(async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
});

exports.getRestaurant = asyncHandler(async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ adminId: req.user._id });
    console.log({ user: req.user._id });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
});

exports.deleteRestaurant = asyncHandler(async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Failed to delete restaurant', error: error.message });
  }
});


