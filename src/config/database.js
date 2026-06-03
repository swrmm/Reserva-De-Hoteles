require('dotenv').config();
const path = require('path');

const storage = process.env.DB_STORAGE || path.resolve(__dirname, '../../database.sqlite');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage,
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage,
    logging: false,
  },
};
