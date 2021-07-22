const { ApiError } = require("../errors/ApiError")
const validator = require("../models/validator");
const errMsg = require("../errors/messages")
const { getProjectMetrics } = require("../models/projects");


async function getMetrics(req, res) {

  const dbParams = req.query

  const { error } = validator.validateMetrics(dbParams);
  if (error) throw ApiError.badRequest(error.message);

  const metrics = await getProjectMetrics(dbParams)
  if (!metrics) throw ApiError.serverError(errMsg.INTERNAL_ERROR);

  res.status(200).json({
    status: 'success',
    data: metrics,
  })
}

module.exports = { getMetrics }
