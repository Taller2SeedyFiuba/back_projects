'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const modelsDirectory = __dirname + '/models'
const { env, databaseURL } = require('../config')
const { logDebug, logInfo } = require('../utils/log')
const db = {};
let options = { logging: logDebug };

if (env == 'production') {
  options['dialectOptions'] = { ssl: { require: true, rejectUnauthorized: false } }
}

logInfo("Conectando con base de datos")
logDebug("Database URL: " + databaseURL)

const sequelize = new Sequelize(databaseURL, options);

fs
  .readdirSync(modelsDirectory)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(modelsDirectory, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.checkStatus = async function(verbose=false){
  try {
    await sequelize.authenticate()
    if (verbose)
      logInfo("La conexion con la base de datos se ha realizado satisfactoriamente")
    return true
  } catch (err) {
    if (verbose)
      throw Error("La conexion con la base de datos ha fallado, " + err.message)
    return false
  }
}

module.exports = db;
