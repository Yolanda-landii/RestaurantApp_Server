const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Import multer
const { 
  getAllRestaurants, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant, 
  deleteAllRestaurants 
} = require('../controllers/restaurantController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const router = express.Router();

// Routes for restaurant operations
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, createRestaurant);


// const upload = multer({ storage });

// router.post('/api/restaurants', upload.single('image'), createRestaurant);


// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// Routes for all restaurants
// router.post('/', upload.single('image'), (req, res, next) => {
//   console.log('File uploaded:', req.file); // Debug log
  
//   next();
// }, createRestaurant);


// Routes for updating and deleting restaurants by ID
router.route('/:id')
  .put(upload.single('image'), updateRestaurant)
  .delete(deleteRestaurant); // Delete a single restaurant by ID

// Route to delete all restaurants (Optional)
router.route('/deleteAll')
  .delete(deleteAllRestaurants);

module.exports = router;
