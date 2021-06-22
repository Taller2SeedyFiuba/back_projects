'use strict';

module.exports = (sequelize, DataTypes) => {
  var ProjectTag = sequelize.define(
    'ProjectTag',
    {
      projectid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      tag: {
        type: DataTypes.CHAR(30),
        primaryKey: true,
      }
      }, {
        tableName: 'projecttag',
        timestamps: false,
    }
  );

  return ProjectTag;
};
