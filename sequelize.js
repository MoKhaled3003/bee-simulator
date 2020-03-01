const Sequelize = require('sequelize');
const config = require('./config/config.json');

const c = config.development;
console.log('here')
// Instantiate new Sequelize instance!
 const sequelize = new Sequelize({
  "username": c.username,
  "password": c.password,
  "database": c.database,
  "host":     c.host,
  "dialect": c.dialect
});

module.exports = {sequelize,Sequelize};