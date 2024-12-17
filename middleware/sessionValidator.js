const { Session, User } = require('../models'); // Assuming models are defined for `Session` and `User`
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const sessionValidator = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }

  const token = authorization.substring(7);
  try {
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token invalid' });
    }

    const session = await Session.findOne({ where: { token } });
    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    const user = await User.findByPk(decodedToken.id);
    if (!user || user.disabled) {
      return res.status(403).json({ error: 'User access disabled' });
    }

    req.user = user; // Attach the user to the request for later use
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};

module.exports = sessionValidator;
