const { getStatus } = require("../database/index");

async function getDatabaseStatus(req, res) {
  await getStatus();

  res.status(200).json({
    status: 'success',
    data: null,
  })
}

module.exports = { getDatabaseStatus }