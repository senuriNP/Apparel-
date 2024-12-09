const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE user profile
router.put('/:id', async (req, res) => {
  const { name, email, phone, address, country } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, country },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
