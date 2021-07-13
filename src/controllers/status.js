const { checkStatus } = require("../database/index");
const { ApiError } = require("../errors/ApiError")
const errMsg = require("../errors/messages")

async function getDatabaseStatus(req, res) {
  const status = await checkStatus();

  if (!status)
    throw ApiError.serverError(errMsg.DATABASE_CONNECTION_ERROR)
  res.status(200).json({
    status: 'success',
    data: null,
  })
}

module.exports = { getDatabaseStatus }
