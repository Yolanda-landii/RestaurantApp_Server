const express = require('express');
const { getAllRestaurants, createRestaurant } = require('../controllers/restaurantController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.route('/')
  .get(getAllRestaurants)
  .post(upload.single('image'), createRestaurant);

module.exports = router;
