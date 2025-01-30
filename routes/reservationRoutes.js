const express = require('express');
const { createReservation, getUserReservations, cancelReservation, getAdminReservations, approveReservation, confirmReservation } = require('../controllers/ReservationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createReservation)       
  .get(protect, getUserReservations);     

router.route('/admin')
  .post(protect, createReservation)       
  .get(protect, getAdminReservations);    

router.route('/:id')
  .delete(protect, cancelReservation)     
  .put(protect, approveReservation)       
  // .put(protect, confirmReservation);      

module.exports = router;
