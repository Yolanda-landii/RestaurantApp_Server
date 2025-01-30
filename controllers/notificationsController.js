const asyncHandler = require('../middleware/asyncHandler');
const Notification = require('../models/notifications');

// Helper function to send notification
const sendNotification = async (userId, message) => {
  await Notification.create({ user: userId, message });
};

// Update reservation approval
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

  await sendNotification(reservation.user, `Your reservation for ${adminRestaurant.name} has been approved.`);

  res.status(200).json({ message: 'Reservation approved', reservation });
});

// Confirm reservation
exports.confirmReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  const adminRestaurant = await Restaurant.findById(reservation.restaurant);
  if (adminRestaurant.adminId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  reservation.status = 'Confirmed';
  await reservation.save();

  await sendNotification(reservation.user, `Your reservation at ${adminRestaurant.name} is confirmed!`);

  res.status(200).json({ message: 'Reservation confirmed', reservation });
});

// Cancel reservation
exports.cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  await sendNotification(reservation.user, `Your reservation at ${reservation.restaurant.name} has been canceled.`);

  res.status(200).json({ message: 'Reservation canceled' });
});

// Get user notifications
exports.getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  });
  
 // Mark notification as read
exports.markAsRead = asyncHandler(async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  });