const router = require('express').Router();
const { User } = require('../models');

// Create a new user
router.post('/', async (req, res, next) => {
  try {
    const { name, username } = req.body;

    if (!name || !username) {
      return res.status(400).json({ error: 'Name and username are required' });
    }

    const newUser = await User.create({ name, username });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Update a user's username
router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ error: 'New username is required' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = newUsername;
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
