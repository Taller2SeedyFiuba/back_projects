const { ApiError } = require("../errors/ApiError");
const { Project } = require("../database/models/projects")
const Joi = require("joi")


class ProjectsController {

  constructor(aDatabase, aProxy) {
    this.database = aDatabase;
    this.proxy = aProxy
  }

  listProjectValidator(parameters){

    const locationSchema = Joi.object({
      lng: Joi.number().required(),
      lat: Joi.number().required(),
      dist: Joi.number().required()
    }).options({ abortEarly: false });

    const filterSchema = Joi.object({
      id: Project.attSchema['id'],
      ownerid: Project.attSchema['ownerid'],
      stage: Project.attSchema['stage'],
      type: Project.attSchema['type'],
      tags: Project.attSchema['tags'],
      location: locationSchema
    }).options({ abortEarly: false });

    const querySchema = Joi.object({
      filters: filterSchema
    }).options({ abortEarly: false });

    return querySchema.validate(parameters);
  }

  async listProjects(req, res) {

    const projectAvailableColumns = ['id', 'ownerid', 'stage', 'type', 'tags']
    const { lng, lat, dist } = req.query;
    //Construimos el espacio de busqueda de la BD
    let dbParams = {}
    
    if (lng || lat || dist){
      dbParams.filters = {'location' : { lng, lat, dist }}
    }

    Object.entries(req.query).forEach(param => {
      if (projectAvailableColumns.includes(param[0])){
        if (!dbParams.filters) dbParams.filters = {} 
        dbParams.filters[param[0]] = param[1]
      }
    })
    if (dbParams.filters && 
        dbParams.filters.tags && 
        typeof dbParams.filters.tags != 'object'){
      dbParams.filters.tags = [ dbParams.filters.tags ]
    }
    
    const { error } = this.listProjectValidator(dbParams);
    if (error) throw ApiError.badRequest(error.message);

    const projects = await this.database.getAllProjectsResume(dbParams);
    return res.status(200).json({
      status: "success",
      data: projects
    });
  }

  async getProject(req, res) {
    const { id } = req.params;
    const { perm } = req.query;

    if (!Number.isInteger(id)) throw ApiError.badRequest("id must be an integer")

    const project = await this.database.getProject(id, perm);
    if (!project) throw ApiError.notFound("Project not found");
    
    return res.status(200).json({
      status: "success",
      data: project
    });
  }

  async createProject(req, res) {
    
    const { ownerid } = req.body;
    //Validate project attributes
    const { error } = Project.validateNew(req.body);
    if (error) throw ApiError.badRequest(error.message);
  
    //TODO:
    //Comunicacion con el servicio de usuarios para ver si existe el usuario.
    //Quizas en el futuro no haya que filtrar el id del usuario, eso se vera
    await this.proxy.validateUserExistance(ownerid)
    //Create the project
    const newProject = await this.database.createProject(req.body);
    if (!newProject) throw ApiError.serverError("Internal error creating project");

    return res.status(201).json({
      status: "success",
      data: newProject
    });
  }

  async deleteProject(req, res) {

    const { id } = req.params;

    //Check if the id is valid
    if (!Number.isInteger(id)) throw ApiError.badRequest("id must be an integer")
    //Check if there is a project with that id
    const ProjectInDatabase = await this.database.getProject(id);
    if (!ProjectInDatabase) throw ApiError.notFound("Project do not exists")
 
    const projectDeleted = await this.database.deleteProject(id)
    if (!projectDeleted) throw ApiError.serverError("Server error")
    return res.status(200).json({
      status: "success",
    });
  }

  async updateProject(req, res) {
    const { id } = req.params;
    const { root } = req.query;
    //Check if id is valid
    if (!Number.isInteger(id)) throw ApiError.badRequest("id must be an integer")
    //Check project existance
    const projectToUpdate = await this.database.getProject(id);
    if (!projectToUpdate) throw ApiError.notFound("Project not found")
    //Check parameters update pemissions.
    const ableToEdit = Project.validateEditionPermissions(req.body, root);
    if (!ableToEdit) throw ApiError.forbidden("You don't have permissions to edit those attributes");
    //Check if new data is valid.
    const { error } = Project.validateEdition(req.body, root);
    if (error) throw ApiError.badRequest(error.message);
    //Update the project
    const projectUpdated = await this.database.updateProject(id, req.body);
    if (!projectUpdated) throw ApiError.serverError("Server error")
    //PENSAR: Vale la pena un request mas a la BD para devolver el proyecto final?
    return res.status(200).json({
      status: "success",
    });
  }
}

module.exports = { ProjectsController }
