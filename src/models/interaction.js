const { DataTypes } = require('sequelize');

const { TABLES } = require("../database/constants");

const sequelize = require('./index')

const Interaction = sequelize.define(TABLES.interactions, {
  // Model attributes are defined here
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: TABLES.interactions
  // Other model options go here
});

module.exports = Interaction;
