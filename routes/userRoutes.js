const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// const router = express.Router();
// const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;


