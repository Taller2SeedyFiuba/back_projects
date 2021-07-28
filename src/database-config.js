const fs = require('fs');

module.exports = {
  production: {
    url: process.env.DATABASE_URL,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    dialect: 'postgres',
  },
  development: {
    url: process.env.DATABASE_URL,
    logging: console.log,
    dialect: 'postgres',
  },
  testing: {
    url: process.env.DATABASE_URL,
    logging: console.log,
    dialect: 'postgres',
  },
};