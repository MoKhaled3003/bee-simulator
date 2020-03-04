'use strict';
module.exports = (sequelize, DataTypes) => {
  const beePayload = sequelize.define('beePayload', {
    account_id: DataTypes.INTEGER,
    params: DataTypes.STRING,
    amount: DataTypes.STRING,
    request: DataTypes.BLOB,
    response: DataTypes.BLOB,
    action: DataTypes.STRING,
    used:DataTypes.STRING
  }, {});
  beePayload.associate = function(models) {
    // associations can be defined here
  };

  return beePayload;
};