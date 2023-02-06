const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  SERVER_PORT: process.env.PORT || '8000',
  NODE_ENV: process.env.NODE_ENV || '',
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'mysql',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
  FRONT_END_URL: process.env.FRONT_END_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PAYMENT_SUCCESS_URL: process.env.STRIPE_PAYMENT_SUCCESS_URL,
  STRIPE_PAYMENT_CANCEL_URL: process.env.STRIPE_PAYMENT_CANCEL_URL,

  STRIPE_ENDPOINT_SECRET : process.env.STRIPE_ENDPOINT_SECRET,
};
