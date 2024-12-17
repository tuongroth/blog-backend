const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const ReadingList = require('./readingList'); // Import ReadingList model

class Blog extends Model {}

Blog.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Blog',
  }
);

// Blog can belong to many users through ReadingList
Blog.belongsToMany(User, {
  through: ReadingList,
  foreignKey: 'blog_id',
});

module.exports = Blog;

