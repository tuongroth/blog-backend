const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('connected to the database');
  } catch (err) {
    console.error('failed to connect to the database:', err.message);
    process.exit(1);
  }
};

module.exports = { connectToDatabase, sequelize };
