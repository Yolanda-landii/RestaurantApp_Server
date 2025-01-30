const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); // Assuming you have an Admin model

// Admin registration logic
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' }, // Use the admin ID and role in the token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Admin login logic
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin profile' });
  }
};

// Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin profile' });
  }
};

