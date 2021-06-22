const { ApiError } = require("../errors/ApiError");
const Project = require("../models/projects")
const validator = require("../models/project-validator")
const Joi = require("joi")


//Aux function

function listProjectValidator(parameters){

  const locationSchema = Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
    dist: Joi.number().required()
  }).options({ abortEarly: false });

  const filterSchema = Joi.object({
    id: Joi.array().items(validator.attSchema['id']),
    ownerid: validator.attSchema['ownerid'],
    state: validator.attSchema['state'],
    type: validator.attSchema['type'],
    tags: validator.attSchema['tags'],
    location: locationSchema
  }).options({ abortEarly: false });

  const querySchema = Joi.object({
    filters: filterSchema,
    limit: Joi.number().integer().positive(),
    page: Joi.number().integer().positive()
  }).options({ abortEarly: false });

  return querySchema.validate(parameters);
}

function formatDatabseSearch(data){
  const toArray = input => {
    if (Array.isArray(input)) return input
    return [input]
  }
  //Nota: Queremos permitir ciertos campos que puedan ser falsy y no necesariamente undefined.
  let dbParams = {
    filters: {
      id: (data.id != undefined) ? toArray(data.id).map(x => parseInt(x)) : undefined,
      type: data.type,
      ownerid: data.ownerid,
      state: data.state,
      tags: (data.tags != undefined) ? toArray(data.tags) : undefined,
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
  const project = await Project.getProject(id);
  if (!project) throw ApiError.notFound("Project not found");

  return res.status(200).json({
    status: "success",
    data: project
  });
}

async function projectExists(req, res) {
  const { id } = req.params;

  const exists = await Project.projectExists(id);

  return res.status(200).json({
    status: "success",
    data: exists
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
  //Check if there is a project with that id
  const ProjectInDatabase = await Project.getProject(id);
  if (!ProjectInDatabase) throw ApiError.notFound("Project does not exist")

  const projectDeleted = await Project.deleteProject(id)
  if (!projectDeleted) throw ApiError.serverError("Server error")
  return res.status(200).json({
    status: "success",
    data: ProjectInDatabase
  });
}

async function updateProject(req, res) {
  const { id } = req.params;
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
  projectExists,
  createProject,
  deleteProject,
  updateProject
}
