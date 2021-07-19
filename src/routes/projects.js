const router = require("express").Router();
const { hocError } = require('../errors/handler');
const pc = require("../controllers/projects");

router.post('/', hocError(pc.createProject));
router.get('/:id([0-9]+)/exists', hocError(pc.projectExists))
router.get('/:id([0-9]+)', hocError(pc.getProject));
//Posible implementacion
//router.put('/cancel/:id', use(pc.cancelProject.bind(pc)));
router.patch('/:id([0-9]+)', hocError(pc.updateProject));
router.get('/search', hocError(pc.listProjects));
router.delete('/:id([0-9]+)', hocError(pc.deleteProject));


module.exports = router;
