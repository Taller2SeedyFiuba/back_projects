const router = require("express").Router();
//const { validateProject } = require("../database/models/projects")
const { ProjectsController } = require("../controllers/projects.controller");

function getProjectsRouter(database, proxy) {

  const pc = new ProjectsController(database, proxy);

  //Permite atrapar errores sin necesidad de try catch
  const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

  
  router.post('/', use(pc.createProject.bind(pc)));

  router.get('/view/:id', use(pc.getProject.bind(pc)));

  //router.put('/cancel/:id', use(pc.cancelProject.bind(pc)));

  router.put('/:id', use(pc.updateProject.bind(pc)));

  router.get('/filter', use(pc.listProjects.bind(pc)));

  router.delete('/:id', use(pc.deleteProject.bind(pc)));

  //router.get('/:id/agreements', use(pc.getProjectAgreements.bind(pc)));


  return router;
}

module.exports = { getProjectsRouter };





/*

Crear un proyecto -> POST /api
Cancelar un proyecto -> PUT /api/cancel/{pid}
Editar un proyecto -> PUT /api/{pid}?root
Listar proyectos (con filtrado) -> GET /api/filter?lo=numb$lat=numb$
Visualizar proyecto -> GET /api/{pid}?root
Obtener contratos -> GET /api/{pid}/agreements

*/