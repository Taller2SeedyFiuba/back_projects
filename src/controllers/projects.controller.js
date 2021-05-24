const { ApiError } = require("../errors/ApiError");

class ProjectsController {

  constructor(aDatabase, aProxy) {
    this.database = aDatabase;
    this.projectValidator = aDatabase.getProjectValidator();
    this.proxy = aProxy
  }

  async listProjects(req, res) {

    const queryParams = req.query;
    console.log(queryParams.hashtag)
    const { error } = this.projectValidator.validateQueryParameters(queryParams);
    if (error) throw ApiError.badRequest(error.message);

    const projects = await this.database.getAllProjectsResume(queryParams);
    return res.status(200).json({
      message: "List of projects retrieved",
      data: projects
    });
   
  }

  async getProject(req, res) {
    const { id } = req.params;
    const { perm } = req.query;

    const project = await this.database.getProject(id, perm);
    if (!project) throw ApiError.notFound("Project not found");
    
    return res.status(200).json({
      message: (perm ? "Private" : "Public") + " project information retrieved",
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
    if (!this.proxy.userExists(req.body.ownerid)){
      throw ApiError.badRequest("User with id " + ownerid + " do not exist")
    } 
    //Create the project
    const newProject = await this.database.createProject(req.body);
    if (!newProject) throw ApiError.serverError("Internal error creating project");

    //Add tags to the project
    /*
    if (tags && tags.length > 0){
      const tagsAdded = await this.database.projectAddTags(newProject.id, tags)
      if (!tagsAdded) throw ApiError.serverError("Internal error: Project created, but could not add tags to it");
      newProject['tags'] = tags;
    }
    */
    return res.status(201).json({
      message: "Project created successfully",
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
      message: 'User deleted successfully'
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
    if (!ableToEdit) throw ApiError.forbidden("You don't have permissions to edit those atributes");
    //Check if new data is valid.
    const { error } = this.projectValidator.editProject(req.body, root);
    if (error) throw ApiError.badRequest(error.message);
    //Update the project
    //console.log(id)
    //console.log(req.body)
    const projectUpdated = await this.database.updateProject(id, req.body);
    if (!projectUpdated) throw ApiError.serverError("Server error")
    //Update the project tags
    /*
    if (req.params.tags){
      //Delete previous tags
      await this.database.deleteTagsOfProject(id);
      //Create new tags
      const tagsAdded = await this.database.projectAddTags(id, req.params.tags)
      if (!tagsAdded) throw ApiError.serverError("Internal error: Error while updating project tags");
    }
    */
    //Vale la pena un request mas a la BD para devolver el proyecto final?
    return res.status(200).json({
      message: 'User updated successfully'
    });
  }
}

module.exports = { ProjectsController }
