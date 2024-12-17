const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { User } = require('../models');

const authenticateUser = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.substring(7);
      const decodedToken = jwt.verify(token, SECRET);
      req.user = await User.findByPk(decodedToken.id);
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token invalid or missing' });
    }
  } else {
    res.status(401).json({ error: 'Token missing' });
  }
};

module.exports = authenticateUser;
