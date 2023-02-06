const { DataTypes } = require('sequelize');

const { TABLES } = require("../database/constants");

const sequelize = require('./index')

const User = sequelize.define(TABLES.users, {
  email: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  verifiedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  verificationCode: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  googleId: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.STRING,
  },
  user_session: {
    type: DataTypes.STRING,
  },
  wallet: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  referedBy: {
    type: DataTypes.INTEGER,
  },
  referrlCount: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  mailchimpId: {
    type: DataTypes.STRING,
  },
  creditReminder: {
    type: DataTypes.DATE
  }
}, {
  tableName: TABLES.users,
});

module.exports = User;
