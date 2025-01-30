const User = require('../models/User');
const Admin = require('../models/admin');

// Get user profile (For both users and admins)
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user; // From the protect middleware
    if (user.role === 'admin') {
      const admin = await Admin.findById(user._id).select('-password');
      return res.status(200).json(admin);
    } else {
      const userProfile = await User.findById(user._id).select('-password');
      return res.status(200).json(userProfile);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update user profile (For both users and admins)
exports.updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = req.user; // From the protect middleware
    let updatedUser;

    if (user.role === 'admin') {
      updatedUser = await Admin.findByIdAndUpdate(
        user._id,
        { name, email, password }, // You can add any other fields that can be updated
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        { name, email, password },
        { new: true }
      );
    }

    updatedUser.password = password; // Ensure password is updated securely if provided

    return res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Delete user profile (For both users and admins)
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = req.user; // From the protect middleware

    if (user.role === 'admin') {
      await Admin.findByIdAndDelete(user._id);
    } else {
      await User.findByIdAndDelete(user._id);
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting profile' });
  }
};
