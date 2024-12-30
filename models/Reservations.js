const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  partySize: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' },
});

module.exports = mongoose.model('Reservation', ReservationSchema);