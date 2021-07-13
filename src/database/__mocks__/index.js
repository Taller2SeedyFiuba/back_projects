const createProject = require('../models/projects')
const Sequelize = require('sequelize');
//Mock sequelize define
const define = a => {
  return {
    beforeCreate: () => {}
  }
};

const Project = createProject({define}, Sequelize.DataTypes);

module.exports = {
  Project
}
