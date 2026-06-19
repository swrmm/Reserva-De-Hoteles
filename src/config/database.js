require('dotenv').config();
const path = require('path');

const storage = process.env.DB_STORAGE || path.resolve(__dirname, '../../database.sqlite');
const databaseUrl = process.env.DATABASE_URL;

const postgresConfig = {
  dialect: 'postgres',
  url: databaseUrl,
  logging: false,
  dialectOptions:
    process.env.DATABASE_SSL === 'true'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
};

const sqliteConfig = {
  dialect: 'sqlite',
  storage,
  logging: false,
};

module.exports = {
  development: databaseUrl ? postgresConfig : sqliteConfig,
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: databaseUrl ? postgresConfig : sqliteConfig,
};
