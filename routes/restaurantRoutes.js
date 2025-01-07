const express = require('express');
const { 
  getAllRestaurants, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant, 
  deleteAllRestaurants // Optional
} = require('../controllers/restaurantController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Routes for all restaurants
router.route('/')
  .get(getAllRestaurants)
  .post(upload.single('image'), createRestaurant);

// Routes for updating and deleting restaurants by ID
router.route('/:id')
  .put(upload.single('image'), updateRestaurant)
  .delete(deleteRestaurant); // Delete a single restaurant by ID

// Route to delete all restaurants (Optional)
router.route('/deleteAll')
  .delete(deleteAllRestaurants);

module.exports = router;
