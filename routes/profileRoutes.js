const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
//const { getUserProfile, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

// Admin routes
router.get('/admin/profile', protect, getAdminProfile);
router.put('/admin/profile', protect, updateAdminProfile);

/* User routes
router.get('/user/profile', protect, getUserProfile);
*/
module.exports = router;
