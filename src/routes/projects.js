const router = require("express").Router();
const { hocError } = require('../errors/handler');
const pc = require("../controllers/projects");

router.post('/', hocError(pc.createProject));
router.get('/:id([0-9]+)', hocError(pc.getProject));
router.patch('/:id([0-9]+)', hocError(pc.updateProject));
router.get('/search', hocError(pc.listProjects));

module.exports = router;
