const express = require('express');
const router = express.Router();

// Example Route for Restaurants
router.get('/', (req, res) => {
  res.send('Restaurant routes are working!');
});

// Export the router
module.exports = router;
