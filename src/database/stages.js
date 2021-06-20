'use strict';

module.exports = (sequelize, DataTypes) => {
  var Stages = sequelize.define(
    'Stages',
    {
      projectid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      position: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      title: {
        type: DataTypes.CHAR(20),
        primaryKey: false,
        allowNull: false
      },
      description: {
        type: DataTypes.CHAR(255),
        primaryKey: false,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        allowNull: false
      }
    }, {
      tableName: 'stages',
      timestamps: false,
    }
  );

  return Stages;
};
