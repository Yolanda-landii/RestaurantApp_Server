const { protect } = require('../middleware/authMiddleware');

const express = require('express');
const {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  deleteAllRestaurants,getRestaurant,
} = require('../controllers/restaurantController');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.route('/')
  .get(getAllRestaurants)
  .post(protect, upload.single('image'),  createRestaurant);

router.route('/:id')
  .put(upload.single('image'), updateRestaurant)
  .delete(deleteRestaurant);

  router.route('/:id')
  .put(upload.single('image'), updateRestaurant)
  .delete(deleteRestaurant);

  router.route('/admin')

  .get(protect,getRestaurant)
  


module.exports = router;

//adminId: (req.user.id)