// models/session.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Session extends Model {}

Session.init({
  token: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'Session' });

module.exports = Session;
