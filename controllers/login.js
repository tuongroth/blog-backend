const router = require('express').Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET } = require('../util/config');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  const passwordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !passwordValid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = router;
