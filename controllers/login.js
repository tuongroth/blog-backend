const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User } = require('../models');
const { SECRET } = require('../util/config');

// POST /api/login
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Validate password (using bcrypt if implemented)
  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  res.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = router;
