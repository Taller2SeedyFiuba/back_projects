const Sequelize = require("sequelize");
const { ProjectModel, 
        ProjectTagModel, 
        ProjectValidator,
        publicAttributes,
        resumeAttributes } = require("./models/projects")

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
    const location = {
      type: 'Point',
      coordinates: [100.5, 34.6]
    }
    project['location'] = location;
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
  /*
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
        attributes: resumeAttributes,//TODO: Permitir multibusqueda
        //  Esto rompe, ver si tiene sentido permitir filtrar por hashtag Y por otra cosa
        //where: { 
        //  params
        //}
        
      });
      return project;
    }
    return await this.projects.findAll({  attributes: resumeAttributes,
                                          where: queryParams })
  }
  */
  async getAllProjectsResume(params) {

    //console.log(params)

    const searchParams = { 'include': [],
                           'attributes': resumeAttributes }
    
    if (params.filters){
      searchParams['where'] = []
      Object.entries(params.filters).forEach(a => {
        if (a[0] != 'tags' && a[0] != 'location'){
          searchParams.where.push(this.sequelize.where(this.sequelize.col(a[0]), Sequelize.Op.eq, a[1]))
        }
      })
    }
    
    if (params.filters && params.filters.tags){
      searchParams['include'].push({
        'model': this.projectTag,
        'attributes': [],
        'where': {
          tag: params.filters.tags
        },
        required: true
      })
    }
    
    if (params.filters && params.filters.location){
      const lat = params.filters.location.lat
      const lng = params.filters.location.lng
      const dist = params.filters.location.dist

      const location = this.sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
      const distance = this.sequelize.fn('ST_DistanceSphere', this.sequelize.col('location'), location);

      searchParams.order = distance
      searchParams.attributes.push([distance,'distance'])
      searchParams.where.push(this.sequelize.where(distance, Sequelize.Op.lte, dist))
    }
    


    return await this.projects.findAll(searchParams)
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
    //return await this.projects.findByPk(id, { attributes: publicAttributes });
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
      project = await this.projects.findByPk(id, { attributes: publicAttributes });
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
