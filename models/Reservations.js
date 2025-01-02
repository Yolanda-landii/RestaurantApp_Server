const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  partySize: { type: Number, required: true },  
  status: { type: String, default: 'Active', enum: ['Active', 'Cancelled'] },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
