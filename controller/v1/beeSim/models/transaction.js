'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    operationCode: DataTypes.STRING,
    responce: DataTypes.TEXT
  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
  };

  return transaction;
};    