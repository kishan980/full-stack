const { DataTypes } = require('sequelize');

const { TABLES } = require("../database/constants");

const sequelize = require('./index')

const Cart = sequelize.define(TABLES.cart, {
  // Model attributes are defined here
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  itemList: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  firstReminder: {
    type: DataTypes.DATE,
    defaultValue: null
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
  tableName: TABLES.cart
  // Other model options go here
});

module.exports = Cart;
