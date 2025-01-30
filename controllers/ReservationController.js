const asyncHandler = require('../middleware/asyncHandler');
const Reservation = require('../models/Reservations');
const Restaurant = require('../models/Restaurant');

// Create a reservation
exports.createReservation = asyncHandler(async (req, res) => {
  const { restaurant, date, time, partySize } = req.body;

  const restaurantExists = await Restaurant.findById(restaurant);
  if (!restaurantExists) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  const reservation = await Reservation.create({
    restaurant,
    user: req.user._id,
    date,
    time,
    partySize,
    status: 'Pending',  // Initially, the status is 'Pending'
  });

  res.status(201).json(reservation);
});

// Get all reservations for the logged-in user
exports.getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate('restaurant', 'name location cuisine')
    .sort({ date: 1 });

  res.json(reservations);
});

// Get all reservations for the admin's restaurant
exports.getAdminReservations = asyncHandler(async (req, res) => {
  const adminRestaurant = await Restaurant.find({ adminId: req.user._id });
  const reservations = await Reservation.find({ restaurant: adminRestaurant[0]._id })
    .populate('restaurant', 'name location cuisine')
    .sort({ date: 1 });

  res.json(reservations);
});

// Admin: Approve reservation
exports.approveReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  // Check if the logged-in user is the admin for this restaurant
  const adminRestaurant = await Restaurant.findById(reservation.restaurant);
  if (adminRestaurant.adminId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to approve this reservation' });
  }

  if (reservation.status === 'Approved') {
    return res.status(400).json({ message: 'Reservation already approved' });
  }

  reservation.status = 'Approved';
  await reservation.save();

  res.status(200).json({ message: 'Reservation approved successfully', reservation });
});

// Admin: Confirm reservation
exports.confirmReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  // Check if the logged-in user is the admin for this restaurant
  const adminRestaurant = await Restaurant.findById(reservation.restaurant);
  if (adminRestaurant.adminId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to confirm this reservation' });
  }

  if (reservation.status === 'Confirmed') {
    return res.status(400).json({ message: 'Reservation already confirmed' });
  }

  reservation.status = 'Confirmed';
  await reservation.save();

  res.status(200).json({ message: 'Reservation confirmed successfully', reservation });
});

// Cancel reservation
exports.cancelReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found');
    }

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});
