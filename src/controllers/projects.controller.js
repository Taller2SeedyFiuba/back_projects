const { ApiError } = require("../errors/ApiError");
const Joi = require("joi")


class ProjectsController {

  constructor(aDatabase, aProxy) {
    this.database = aDatabase;
    this.projectValidator = aDatabase.getProjectValidator();
    this.proxy = aProxy
  }

  listProjectValidator(parameters){

    const locationSchema = Joi.object({
      lng: Joi.number().required(),
      lat: Joi.number().required(),
      dist: Joi.number().required()
    }).options({ abortEarly: false });

    const filterSchema = Joi.object({
      id: this.projectValidator.att['id'],
      ownerid: this.projectValidator.att['ownerid'],
      stage: this.projectValidator.att['stage'],
      type: this.projectValidator.att['type'],
      tags: this.projectValidator.att['tags'],
      location: locationSchema
    }).options({ abortEarly: false });

    const querySchema = Joi.object({
      //permissions: Joi.boolean()
      //  .required(),
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
    if (dbParams.filters.tags && typeof dbParams.filters.tags != 'object'){
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
    const { error } = this.projectValidator.newProject(req.body);
    if (error) throw ApiError.badRequest(error.message);
  
    //TODO:
    //Comunicacion con el servicio de usuarios para ver si existe el usuario.
    //Quizas en el futuro no haya que filtrar el id del usuario, eso se vera
    //if (!this.proxy.userExists(req.body.ownerid)){
    //  throw ApiError.badRequest("User with id " + ownerid + " do not exist")
    //} 
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
    //Check project existance
    const projectToUpdate = await this.database.getProject(id);
    if (!projectToUpdate) throw ApiError.notFound("Project not found")
    //Check parameters update pemissions.
    const ableToEdit = this.projectValidator.editProjectPermissions(req.body, root);
    if (!ableToEdit) throw ApiError.forbidden("You don't have permissions to edit those attributes");
    //Check if new data is valid.
    const { error } = this.projectValidator.editProject(req.body, root);
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
