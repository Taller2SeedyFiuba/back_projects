const Sequelize = require("sequelize");
const { ProjectModel, 
        ProjectTagModel, 
        ProjectValidator,
        publicAtributes,
        resumeAtributes } = require("./models/projects")

class DataBase {

  constructor() {
    //Establecemos la conexion
    console.log("Conectando con base de datos: \n\t" + process.env.DATABASE_URL + "\n")
    const options = { logging: false,
                      freezeTableName: true }
    //Cambiar por chequeo de produccion o desarrollo
    if (process.env.NODE_ENV == 'production') {
      options['logging'] = console.log
      options['dialectOptions'] = { ssl: { require: true, rejectUnauthorized: false } }
    }

    this.sequelize = new Sequelize(process.env.DATABASE_URL, options);
    //Chequeamos que la conexion se haya realizado
    this.sequelize.authenticate().then(() => {
      console.log('La conexion con la base de datos se ha realizado satisfactoriamente.');
    }).catch(error => {
      console.error('Ha fallado la conexion con la base de datos: \n' + error.message);
    });

    //Creamos el modelado de usuarios
    this.projects = this.sequelize.define('projects', 
                                          ProjectModel, 
                                          { timestamps: false,
                                            freezeTableName: true });
    //Creamos el modelado de proyectos
    this.projectTag = this.sequelize.define('projectTag', 
                                            ProjectTagModel, 
                                            { timestamps: false,
                                              freezeTableName: true,
                                              tableName : 'projecttag'});
    //Asociacion entre las tablas
    this.projects.hasMany(this.projectTag, {foreignKey: 'projectid'})
  }
  async getStatus() {
    return this.sequelize.authenticate();
  }

  async createProject(project) {
    let result = await this.projects.create(project);
    //console.log(result.dataValues)
    if (result && project.tags && project.tags.length > 0){
      const id = result.dataValues.id
      await this.projectTag.destroy({ where: { projectid : id } });
      if (!await this.projectAddTags(id, project.tags)){
        this.deleteProject(id);
        return 0;
      }
    }
    return result
  }

  async getAllProjectsResume(queryParams) {

    //TODO: - Manejo de filtrado por hashtags, con join
    //      - Manejar la query geografica, quizas con un sequelize.raw
    let project = {}
    if (queryParams.hashtag){
      //const params = Object.assign({}, queryParams.Params, { hashtag: undefined })
      project = await this.projects.findAll({
        include: [{
            model: this.projectTag,
            attributes: [],
            where: {
              tag: queryParams.hashtag
            },
            required: true
        }],
        attributes: resumeAtributes,
        /*  Esto rompe, ver si tiene sentido permitir filtrar por hashtag Y por otra cosa
        where: { 
          params
        }
        */
      });
      return project;
    }
    return await this.projects.findAll({  attributes: resumeAtributes,
                                          where: queryParams })
  }

  async getProject(id, perm){
    /* ANDA, PERO DEVUELVE A LOS TAGS COMO OBJETO.
    let project = {}
    if (perm){
      project = await this.projects.findAll({
        include: [{
            model: this.projectTag,
            attributes: ['tag'],
            where: {
              projectid: id
            }
        }],
        where: { 
          id 
        }
      }) //return await this.projects.findByPk(id);
    }
    //return await this.projects.findByPk(id, { attributes: publicAtributes });
    project = await this.projects.findAll({
      include: [{
        model: this.projectTag,
        attributes: ['tag'],
        where: {
          projectid: id
        }
      }],
      where: { 
        id 
      }
    })
    */
    const tags = await this.projectTag.findAll({ attributes: ['tag'], where: { projectid : id}})
    let project = {};
    if (perm){
      project = await this.projects.findByPk(id);
    } else {
      project = await this.projects.findByPk(id, { attributes: publicAtributes });
    }
    if (!project) return project;
    project.dataValues['tags'] = [];
    tags.forEach(entry => { project.dataValues['tags'].push(entry.dataValues.tag) });
    return project;
  }

  async deleteProject(id){
    await this.projectTag.destroy({ where: { projectid : id } });
    return await this.projects.destroy({ where: { id } });
  }

  async projectAddTags(projectid, tags){
    let newTags = [];
    tags.forEach(tag => newTags.push({ projectid, tag }))
    return await this.projectTag.bulkCreate(newTags, { returning: true })
  }

  async updateProject(id, newData) {
    const response = await this.projects.update(newData, { where: { id } });
    if (!response || !response[0]) return 0;
    if (newData.tags && newData.tags.length > 0){
      await this.projectTag.destroy({ where: { projectid : id } });
      if (!await this.projectAddTags(id, newData.tags)) return 0;
    }
    return response[0];
  }
  
  getProjectValidator() {
    return new ProjectValidator();
  }
}


module.exports = { DataBase };
