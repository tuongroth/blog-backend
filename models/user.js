const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class User extends Model {}
User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'user', underscored: true }
);

module.exports = User;
