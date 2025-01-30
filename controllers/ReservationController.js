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
  });

  res.status(201).json(reservation);
});

// Get all reservations for the logged-in user
exports.getUserReservations = asyncHandler(async (req, res) => {
  console.log("test",req.user);
  const reservations = await Reservation.find({ user: req.user._id })
    .populate('restaurant', 'name location cuisine')
    .sort({ date: 1 });
  console.log(reservations);
  res.json(reservations);
});

// Admin: View all reservations for a specific restaurant
exports.getRestaurantReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ restaurant: req.params.restaurantId })
    .populate('user', 'name email')
    .sort({ date: 1 });

  res.json(reservations);
});

// Edit or cancel a reservation
exports.updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  if (reservation.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this reservation' });
  }

  const updates = req.body;
  Object.assign(reservation, updates);
  await reservation.save();

  res.status(200).json(reservation);
});
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