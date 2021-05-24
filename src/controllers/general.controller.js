const { sequelize } = require("../database/database");

async function getDatabaseStatus(req, res) {
  await this.sequelize.getStatus();
  res.status(200).json({
    "message": "Connection with database has been established successfully."
  })
}


module.exports = { getDatabaseStatus }
