const express = require('express');
const { getAllUsers, getAllRestaurants } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();

router.get('/users', protect, admin, getAllUsers);
router.get('/restaurants', protect, admin, getAllRestaurants);

module.exports = router;