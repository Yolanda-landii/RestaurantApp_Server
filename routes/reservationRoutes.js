const express = require('express');
const { createReservation, getUserReservations } = require('../controllers/ReservationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createReservation).get(protect, getUserReservations);

module.exports = router;