const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use('/auth', authRoutes);

// Additional routes
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
