// routes/logout.js
const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const { authenticateToken } = require('../middleware/auth');

router.delete('/api/logout', authenticateToken, async (req, res) => {
  const token = req.token;

  try {
    await Session.destroy({ where: { token } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to log out' });
  }
});

module.exports = router;
