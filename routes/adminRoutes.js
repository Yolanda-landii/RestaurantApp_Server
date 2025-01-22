const express = require('express');
const { getAllUsers, getAllRestaurants } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
// const router = express.Router();

// const express = require('express');
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

const router = express.Router();

// Admin registration
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// module.exports = router;

// router.get('/users', protect, admin, getAllUsers);
// router.get('/restaurants', protect, admin, getAllRestaurants);

module.exports = router;