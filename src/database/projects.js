'use strict';

module.exports = (sequelize, DataTypes) => {

  const type_enum = ['software', 'electronics', 'art'];
  const stage_enum =  ['funding', 'finished', 'cancelled'];

  var Project = sequelize.define(
    'Project',
    {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        ownerid: {
          type: DataTypes.CHAR(255),
          allowNull: false,
        },
        title: {
          type: DataTypes.CHAR(80),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM(...type_enum),
          allowNull: false,
        },
        location: {
          type: DataTypes.GEOMETRY,
          allowNull: false,
        },
        stage: {
          type: DataTypes.ENUM(...stage_enum),
        },
        creationdate: {
          type: DataTypes.DATE,
        },
        finishdate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        sponsorshipagreement: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        seeragreement: {
          type: DataTypes.TEXT,
          allowNull: false,
        }
    }, {
      tableName: 'projects',
      timestamps: false,
    }
  );

  Project.beforeCreate((user, options) => {
    user.creationdate = new Date().toISOString();
  })
  
  Project.associate = function (models) {
    models.Project.hasMany(models.ProjectTag, {foreignKey: 'projectid'})
    models.Project.hasMany(models.Multimedia, {foreignKey: 'projectid'})
  }

  return Project;
};