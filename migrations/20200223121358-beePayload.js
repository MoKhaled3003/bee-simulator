'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('beePayload', {
      account_id: {
        type: Sequelize.INTEGER
      },
      params: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      request: {
        type: Sequelize.TEXT
      },
      response: {
        type: Sequelize.TEXT
      },
      action: {
        type: Sequelize.STRING
      },
      used: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE beePayload ADD PRIMARY KEY (account_id, params, amount)');
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('beePayload');
  }
};