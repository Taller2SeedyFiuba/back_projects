'use strict';

module.exports = (sequelize, DataTypes) => {

  const type_enum = [
    'comida',
	  'arte',
	  'periodismo',
	  'manualidades',
	  'música',
	  'danza',
	  'fotografía',
	  'diseño',
	  'publicaciones',
	  'tecnología',
	  'software',
	  'refugio',
	  'transporte',
	  'legal'
  ];

  const state_enum =  [
    'on_review',
	  'funding',
	  'canceled',
	  'in_progress',
	  'completed'
  ];

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
        type: DataTypes.CHAR(45),
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
      state: {
        type: DataTypes.ENUM(...state_enum),
        allowNull: false,
        defaultValue: state_enum[0]
      },
      actualstage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      location: {
        type: DataTypes.GEOMETRY,
        allowNull: false,
      },
      locationdescription: {
        type: DataTypes.CHAR(80),
        allowNull: false,
      },
      creationdate: {
        type: DataTypes.DATE,
      },
      sponsorscount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      favouritescount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      fundedamount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
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
    models.Project.hasMany(models.Stages, {foreignKey: 'projectid'})
  }

  Project.enums = {
    type: type_enum,
    state: state_enum
  }

  Project.attributes = {
    resume: [
      'id',
      'ownerid',
      'title',
      'state',
      'type',
      'location',
      'locationdescription'
    ],
    public: [
      'ownerid',
      'id',
      'title',
      'description',
      'type',
      'state',
      'actualstage',
      'creationdate',
      'location',
      'locationdescription',
      'fundedamount',
      'sponsorscount',
      'favouritescount'
    ]
  }

  return Project;
};
