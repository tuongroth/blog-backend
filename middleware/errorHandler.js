const errorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    res.status(400).json({ error: err.errors.map((e) => e.message) });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = errorHandler;
