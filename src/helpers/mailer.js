const nodemailer = require('nodemailer');
const { logger } = require('./logger');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM_NAME,
  SMTP_FROM,
} = require('../config/config');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

module.exports.sendMail = function (to, subject, html, cb) {
  const mailOptions = {
    from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`, // sender address
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      logger.error(error);
    } else {
      cb(info);
    }
  });
};
