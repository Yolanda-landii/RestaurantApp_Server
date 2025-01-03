const express = require('express');
const { getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 

// Routes for restaurant actions
router.route('/')
  .get(getAllRestaurants)

router.route('/:id')
  .put(upload.single('image'), updateRestaurant)  
  .delete(deleteRestaurant);

module.exports = router;
