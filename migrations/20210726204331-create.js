'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const project_types = [
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

    const project_state = [
      'on_review',
      'funding',
      'canceled',
      'in_progress',
      'completed'
    ];

    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
      ownerid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM(project_types),
      },
      state: {
        allowNull: false,
        type: Sequelize.ENUM(project_state),
        defaultValue: 'on_review'
      },
      actualstage: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      creationdate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      location: {
        type: Sequelize.GEOMETRY
      },
      locationdescription: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sponsorscount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      favouritescount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      fundedamount: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
    });

    await queryInterface.createTable('projecttag', {
      projectid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tag: {
        type: Sequelize.STRING(30),
        allowNull: false,
      }
    });

    await queryInterface.createTable('multimedia', {
      projectid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });

    await queryInterface.createTable('stages', {
      projectid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      }
    });

    await queryInterface.addConstraint('projecttag', {
      type: 'primary key',
      name: 'vf_primary_projectid_tag',
      fields: ['projectid', 'tag'],
    });

    await queryInterface.addConstraint('projecttag', {
      type: 'foreign key',
      name: 'vfkey_projectid_tag',
      fields: ['projectid'],
      references: { //Required field
        table: 'projects',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addConstraint('multimedia', {
      type: 'primary key',
      name: 'pk_multimedia',
      fields: ['projectid', 'position'],
    });

    await queryInterface.addConstraint('multimedia', {
      type: 'foreign key',
      name: 'fk_multimedia',
      fields: ['projectid'],
      references: { //Required field
        table: 'projects',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });


    await queryInterface.addConstraint('stages', {
      type: 'primary key',
      name: 'pk_stages',
      fields: ['projectid', 'position'],
    });

    await queryInterface.addConstraint('stages', {
      type: 'foreign key',
      name: 'fk_stages',
      fields: ['projectid'],
      references: { //Required field
        table: 'projects',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('projecttag');
    await queryInterface.dropTable('multimedia');
    await queryInterface.dropTable('stages');
  }
};