const { ApiError } = require("../errors/ApiError");
const Project = require("../models/projects")
const validator = require("../models/project-validator")
const proxy = require("../proxy/proxy")
const Joi = require("joi")


//Aux function

function listProjectValidator(parameters){

  const locationSchema = Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
    dist: Joi.number().required()
  }).options({ abortEarly: false });

  const filterSchema = Joi.object({
    ownerid: validator.attSchema['ownerid'],
    state: validator.attSchema['state'],
    type: validator.attSchema['type'],
    tags: validator.attSchema['tags'],
    location: locationSchema
  }).options({ abortEarly: false });

  const querySchema = Joi.object({
    filters: filterSchema,
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  }).options({ abortEarly: false });

  return querySchema.validate(parameters);
}

async function listProjects(req, res) {
  const projectAvailableFilters = ['ownerid', 'state', 'type', 'tags']
  const { lng, lat, dist, limit, page } = req.query;
  //Construimos el espacio de busqueda de la BD
  let dbParams = { limit, page }

  if (lng || lat || dist){
    dbParams.filters = {'location' : { lng, lat, dist }}
  }

  Object.entries(req.query).forEach(param => {
    if (projectAvailableFilters.includes(param[0])){
      if (!dbParams.filters) dbParams.filters = {}
      dbParams.filters[param[0]] = param[1]
    }
  })

  if (dbParams.filters &&
      dbParams.filters.tags &&
      typeof dbParams.filters.tags != 'object'){
    dbParams.filters.tags = [ dbParams.filters.tags ]
  }

  const { error } = listProjectValidator(dbParams);
  if (error) throw ApiError.badRequest(error.message);
  const projects = await Project.getAllProjectsResume(dbParams);
  return res.status(200).json({
    status: "success",
    data: projects
  });
}

async function getProject(req, res) {
  const { id } = req.params;
  const isNumber = /^\d+$/.test(id);
  if (!isNumber) throw ApiError.badRequest("id must be an integer")
  const project = await Project.getProject(id);
  if (!project) throw ApiError.notFound("Project not found");

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
  if (!newProject) throw ApiError.serverError("Internal error creating project");
  return res.status(201).json({
    status: "success",
    data: newProject
  });
}

async function deleteProject(req, res) {
  const { id } = req.params;
  //Check if the id is valid
  const isNumber = /^\d+$/.test(id);
  if (!isNumber) throw ApiError.badRequest("id must be an integer")
  //Check if there is a project with that id
  const ProjectInDatabase = await Project.getProject(id);
  if (!ProjectInDatabase) throw ApiError.notFound("Project do not exists")

  const projectDeleted = await Project.deleteProject(id)
  if (!projectDeleted) throw ApiError.serverError("Server error")
  return res.status(200).json({
    status: "success",
    data: ProjectInDatabase
  });
}

async function updateProject(req, res) {
  const { id } = req.params;
  //Check if id is valid
  const isNumber = /^\d+$/.test(id);
  if (!isNumber) throw ApiError.badRequest("id must be an integer")
  //Check project existance
  const projectToUpdate = await Project.getProject(id);
  if (!projectToUpdate) throw ApiError.notFound("Project not found")
  //Check if new data is valid.
  const { error, data } = validator.validateAndFormatEdition(projectToUpdate, req.body);
  if (error) throw ApiError.badRequest(error.message);
  //Update the project
  const projectUpdated = await Project.updateProject(id, data);
  if (!projectUpdated) throw ApiError.serverError("Server error")

  return res.status(200).json({
    status: "success",
    data: projectUpdated
  });
}


module.exports = {
  listProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject
}
