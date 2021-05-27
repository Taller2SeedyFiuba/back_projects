const router = require("express").Router();
const { hocError } = require('../errors/handler');
const pc = require("../controllers/projects");

function getProjectsRouter(database, proxy) {

  router.post('/', hocError(pc.createProject));

  router.get('/view/:id', hocError(pc.getProject));

  //Posible implementacion
  //router.put('/cancel/:id', use(pc.cancelProject.bind(pc)));

  router.put('/:id', hocError(pc.updateProject));

  router.get('/search', hocError(pc.listProjects));

  router.delete('/:id', hocError(pc.deleteProject));

  return router;
}

module.exports = { getProjectsRouter };
