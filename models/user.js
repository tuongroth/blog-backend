const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const Blog = require('./blog'); // Import Blog model
const ReadingList = require('./readingList');

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

// User can have many blogs through ReadingList
User.belongsToMany(Blog, {
  through: ReadingList,
  foreignKey: 'user_id',
});

module.exports = User;
