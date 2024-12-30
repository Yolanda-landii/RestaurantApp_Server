const asyncHandler = require('./middleware/asyncHandler');
const Reservation = require('./models/reservations');

exports.createReservation = asyncHandler(async (req, res) => {
  const { restaurant, date, time, partySize } = req.body;
  const reservation = await Reservation.create({
    restaurant,
    user: req.user._id,
    date,
    time,
    partySize,
  });
  res.status(201).json(reservation);
});

exports.getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).populate('restaurant');
  res.json(reservations);
});
