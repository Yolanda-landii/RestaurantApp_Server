const asyncHandler = require('../middleware/asyncHandler');
const Reservation = require('../models/Reservations');
const Restaurant = require('../models/Restaurant');
const Notification = require('../models/notifications');

// Helper function to send notification
const sendNotification = async (userId, message) => {
  await Notification.create({ user: userId, message });
};

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

  // Notify Admin
  await sendNotification(restaurantExists.adminId, `New reservation request for ${restaurantExists.name}.`);

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

// Approve reservation (Admin)
exports.approveReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  const adminRestaurant = await Restaurant.findById(reservation.restaurant);
  if (adminRestaurant.adminId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  reservation.status = 'Approved';
  await reservation.save();

  // Notify User
  await sendNotification(reservation.user, `Your reservation at ${adminRestaurant.name} has been approved.`);

  res.status(200).json({ message: 'Reservation approved', reservation });
});
// // Admin: Confirm reservation
// exports.confirmReservation = asyncHandler(async (req, res) => {
//   const reservation = await Reservation.findById(req.params.id);

//   if (!reservation) {
//     return res.status(404).json({ message: 'Reservation not found' });
//   }

//   // Check if the logged-in user is the admin for this restaurant
//   const adminRestaurant = await Restaurant.findById(reservation.restaurant);
//   if (adminRestaurant.adminId.toString() !== req.user._id.toString()) {
//     return res.status(403).json({ message: 'Not authorized to confirm this reservation' });
//   }

//   if (reservation.status === 'Confirmed') {
//     return res.status(400).json({ message: 'Reservation already confirmed' });
//   }

//   reservation.status = 'Confirmed';
//   await reservation.save();

//   res.status(200).json({ message: 'Reservation confirmed successfully', reservation });
// });

// Cancel reservation (Admin)
exports.cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  // Notify User
  await sendNotification(reservation.user, `Your reservation at ${reservation.restaurant.name} has been canceled.`);

  res.status(200).json({ message: 'Reservation canceled' });
});
