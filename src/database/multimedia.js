'use strict';

module.exports = (sequelize, DataTypes) => {
  var Multimedia = sequelize.define(
    'Multimedia',
    {
      projectid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      position: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      url: {
        type: DataTypes.CHAR(255),
        primaryKey: false,
      }     
      }, {
        tableName: 'multimedia',
        timestamps: false,
    }
  );

  return Multimedia;
};