const asyncHandler = require('../middleware/asyncHandler');
const Reservation = require('../models/Reservations'); 

// Create Reservation
exports.createReservation = asyncHandler(async (req, res) => {
  console.log('Received reservation data:', req.body);

  const { restaurant, date, time, partySize } = req.body;

  if (!restaurant || !date || !time || !partySize) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const reservation = await Reservation.create({
    restaurant,
    user: req.user._id,
    date,
    time,
    partySize,
  });

  res.status(201).json(reservation);
});



// Get User Reservations
exports.getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).populate('restaurant');
  res.status(200).json(reservations);
});

// Update Reservation
exports.updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(reservation);
});

// Cancel Reservation
exports.deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status: 'Cancelled' },
    { new: true }
  );
  res.status(200).json(reservation);
});
