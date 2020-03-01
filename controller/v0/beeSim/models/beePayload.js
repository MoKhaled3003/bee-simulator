'use strict';
module.exports = (sequelize, DataTypes) => {
  const beePayload = sequelize.define('beePayload', {
    account_id: DataTypes.INTEGER,
    params: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    request: DataTypes.TEXT,
    response: DataTypes.TEXT,
    action: DataTypes.STRING,
    used:DataTypes.STRING
  }, {});
  beePayload.associate = function(models) {
    // associations can be defined here
  };
  beePayload.removeAttribute('id');

  return beePayload;
};