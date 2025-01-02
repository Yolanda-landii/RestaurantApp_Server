const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');

// Protect middleware (for authentication)
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password');
      
      // Ensure the user is not an admin
      if (req.user.role === 'admin') {
        return res.status(403).json({ message: 'Admins cannot make reservations' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});


// Admin check middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
