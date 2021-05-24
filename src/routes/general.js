const { Router } = require('express');
const router = Router();

const {
  getDatabaseStatus
} = require("../controllers/general.controller");

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// /api/general/status
const getGeneralRouter = (database) => {

  router.get('/status', use(getDatabaseStatus.bind({ sequelize: database })));
  return router;
}

module.exports = { getGeneralRouter }
