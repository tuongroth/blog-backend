const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const User = require('./user'); // Ensure User is imported

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'blog',
  underscored: true,
});

Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Associate Blog with User

module.exports = Blog;
