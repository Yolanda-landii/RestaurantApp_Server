const express = require('express');
const {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  deleteAllRestaurants,
} = require('../controllers/restaurantController');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.route('/')
  .get(getAllRestaurants)
  .post(upload.single('image'), createRestaurant);

router.route('/:id')
  .put(upload.single('image'), updateRestaurant)
  .delete(deleteRestaurant);

router.route('/deleteAll').delete(deleteAllRestaurants);

module.exports = router;
