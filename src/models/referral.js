
const { DataTypes } = require('sequelize');

const { TABLES } = require("../database/constants");

const sequelize = require('./index')

const Referral = sequelize.define(TABLES.referral, {
  // Model attributes are defined here
  userId:{
    type: DataTypes.INTEGER,
  },
  referedBy:{
    type: DataTypes.INTEGER,
  },
  email:{
    type : DataTypes.STRING,
  },
  link:{
    type : DataTypes.STRING,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
  creditAssigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: TABLES.referral,
  // Other model options go here
});

module.exports = Referral;

