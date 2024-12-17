// middleware/auth.js
const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const session = await Session.findOne({ where: { token } });
    if (!session) return res.status(401).json({ error: 'Invalid token' });

    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findByPk(decodedToken.id);

    if (!user || user.disabled) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };

