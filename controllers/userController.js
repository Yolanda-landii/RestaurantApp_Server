const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// User Registration Logic
// User Registration Logic
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed in the pre('save') middleware)
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({
      message: 'Registration failed',
      error: err.message,
      stack: err.stack,
    });
  }
};

// User Login Logic
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request body:', req.body); // Log the request body

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
