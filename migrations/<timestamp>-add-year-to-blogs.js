'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Blogs', 'year', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        max: new Date().getFullYear(),
      },
      defaultValue: 1991,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Blogs', 'year');
  },
};
