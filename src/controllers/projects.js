const { ApiError } = require("../errors/ApiError");
const errMsg = require("../errors/messages")
const Project = require("../models/projects")
const validator = require("../models/validator")


function formatDatabseSearch(data){

  //Nota: Queremos permitir ciertos campos que puedan ser falsy y no necesariamente undefined.
  let dbParams = {
    filters: {
      id: data.id,
      type: data.type,
      ownerid: data.ownerid,
      state: data.state,
      tags: data.tags,
      location: (data.lat == undefined) ? undefined : {
        lat: data.lat,
        lng: data.lng,
        dist: data.dist
      }
    },
    limit: data.limit,
    page: data.page
  }

  let deleteFilters = true
  Object.entries(dbParams.filters).forEach(att => {
    if (att[1] == undefined){
      delete dbParams.filters[att[0]]
    } else{
      deleteFilters = false
    }
  })
  if (deleteFilters)
    delete dbParams['filters']

  return dbParams
}

async function listProjects(req, res) {

  const dbParams = formatDatabseSearch(req.query)
  const { error } = validator.validateSearch(dbParams);
  if (error) throw ApiError.badRequest(error.message);
  const projects = await Project.getAllProjectsResume(dbParams);
  return res.status(200).json({
    status: "success",
    data: projects
  });
}

async function getProject(req, res) {
  const { id } = req.params;
  const project = await Project.getProject(id);
  if (!project) throw ApiError.notFound(errMsg.PROJECT_NOT_FOUND);

  return res.status(200).json({
    status: "success",
    data: project
  });
}

async function createProject(req, res) {

  //Validate project attributes
  const { error } = validator.validateNew(req.body);
  if (error) throw ApiError.badRequest(error.message);

  //Create the project
  const newProject = await Project.createProject(req.body);
  if (!newProject) throw ApiError.serverError(errMsg.INTERNAL_ERROR);
  return res.status(201).json({
    status: "success",
    data: newProject
  });
}

async function updateProject(req, res) {
  const { id } = req.params;
  //Check project existance
  const projectToUpdate = await Project.getProject(id);
  if (!projectToUpdate) throw ApiError.notFound(errMsg.PROJECT_NOT_FOUND)
  //Check if new data is valid.
  const { error, data } = validator.validateAndFormatEdition(projectToUpdate, req.body);
  if (error) throw ApiError.badRequest(error.message);
  //Update the project
  const projectUpdated = await Project.updateProject(id, data);
  if (!projectUpdated) throw ApiError.serverError(errMsg.INTERNAL_ERROR)

  return res.status(200).json({
    status: "success",
    data: projectUpdated
  });
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
}
