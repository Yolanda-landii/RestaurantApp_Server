const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/dashboard', authenticate, isAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

module.exports = router;
