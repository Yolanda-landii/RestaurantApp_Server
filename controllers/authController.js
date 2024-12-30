const jwt = require('jsonwebtoken');
const User = require('./models/user');
const asyncHandler = require('../middleware/asyncHandler');
const generateToken = require('../utils/generateToken');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.status(201).json({ token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user._id);
  res.json({ token });
});