const { DataTypes } = require('sequelize');

const { TABLES } = require("../database/constants");

const sequelize = require('./index')

const Credit = sequelize.define(TABLES.credits, {
  // Model attributes are defined here
  userId: {
    type: DataTypes.INTEGER,
    // allowNull defaults to true
  },
  signingBonousAt: {
    type: DataTypes.DATE
    // allowNull defaults to true
  },
  alertOnSignUp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
    // allowNull defaults to true
  },
  alertForInvite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
    // allowNull defaults to true
  },
  firstReminder: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  secondReminder: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: TABLES.credits,
  // Other model options go here
});

// Credit.associate = (model) => {
//   Credit.belongsTo(model.User, { foreignKey: "userId"})
// }
module.exports = Credit;

