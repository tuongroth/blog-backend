// migrations/<timestamp>-add-disabled-column-to-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'disabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'disabled');
  },
};
