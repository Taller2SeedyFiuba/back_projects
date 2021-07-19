const projects = require('./projects');
const { getDatabaseStatus } = require('../controllers/status')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');
const { hocError } = require("../errors/handler");
const { getMetrics } = require('../controllers/metrics');


const startRoutes = (app) => {

  app.get('/api/status', hocError(getDatabaseStatus))

  app.get('/api/metrics', hocError(getMetrics))

  app.use('/api', projects)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = startRoutes;
