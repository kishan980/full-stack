const { DataTypes } = require('sequelize');

const { TABLES } = require("../database/constants");

const sequelize = require('./index')

const Image = sequelize.define(TABLES.images, {
  // Model attributes are defined here
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reminderAt: {
    type: DataTypes.DATE
  },
  secondReminder: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  thirdReminder: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: TABLES.images
  // Other model options go here
});

module.exports = Image;
