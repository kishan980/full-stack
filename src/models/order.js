const { DataTypes } = require('sequelize');

const { TABLES } = require("../database/constants");

const sequelize = require('./index')

const Order = sequelize.define(TABLES.order, {
  // Model attributes are defined here
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },    
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false
  },  
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  orderDate: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: TABLES.order
  // Other model options go here
});

module.exports = Order;
