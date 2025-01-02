const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {createReservation,getUserReservations,updateReservation,deleteReservation,} = require('../controllers/ReservationController');

const router = express.Router();

router.route('/')
  .post(protect, createReservation) 
  .get(protect, getUserReservations); 

router.route('/:id')
  .put(protect, updateReservation) 
  .delete(protect, deleteReservation); 

module.exports = router;
