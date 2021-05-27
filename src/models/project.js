const { Project, 
        ProjectTag, 
        Sequelize, 
        sequelize } = require("../database");
const ProjectModel = require('./project-validator')

async function getStatus() {
    return sequelize.authenticate();
}

async function createProject(project) {
  let id = 0;
  const location = {
    type: 'Point',
    coordinates: [project.location.lng, project.location.lat]
  }
  project['location'] = location;
  let result = await Project.create(project);
  if (result && project.tags && project.tags.length > 0){
    id = result.dataValues.id
    await ProjectTag.destroy({ where: { projectid : id } });
    if (!await projectAddTags(id, project.tags)){
      deleteProject(id);
      return 0;
    }
  }
  return result ? getProject(id) : 0
}

async function getAllProjectsResume(params) {
  const searchParams = { 'include': [],
                         'attributes': ProjectModel.attributes.resume }
  
  if (params.filters){
    searchParams['where'] = []
    Object.entries(params.filters).forEach(a => {
      if (a[0] != 'tags' && a[0] != 'location'){
        searchParams.where.push(sequelize.where(sequelize.col(a[0]), Sequelize.Op.eq, a[1]))
      }
    })
  }
  
  if (params.filters && params.filters.tags){
    searchParams['include'].push({
      'model': ProjectTag,
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
    const location = sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
    const distance = sequelize.fn('ST_DistanceSphere', sequelize.col('location'), location);
    searchParams.order = distance
    searchParams.attributes.push([distance,'distance'])
    searchParams.where.push(sequelize.where(distance, Sequelize.Op.lte, dist))
  }

  return await Project.findAll(searchParams)
}

async function getProject(id, perm){
  const tags = await ProjectTag.findAll({ attributes: ['tag'], where: { projectid : id}})
  let project = {};
  if (perm){
    project = await Project.findByPk(id, { attributes: ProjectModel.attributes.public });
  } else {
    project = await Project.findByPk(id, { attributes: ProjectModel.attributes.publicPrivate });
  }
  if (!project) return project;
  project.dataValues['tags'] = [];
  tags.forEach(entry => { project.dataValues['tags'].push(entry.dataValues.tag) });
  return project;
}

async function deleteProject(id){
  await ProjectTag.destroy({ where: { projectid : id } });
  return await Project.destroy({ where: { id } });
}

async function projectAddTags(projectid, tags){
  let newTags = [];
  tags.forEach(tag => newTags.push({ projectid, tag }))
  return await ProjectTag.bulkCreate(newTags, { returning: true })
}

async function updateProject(id, newData) {
  const response = await Project.update(newData, { where: { id } });
  if (!response || !response[0]) return 0;
  if (newData.tags && newData.tags.length > 0){
    await ProjectTag.destroy({ where: { projectid : id } });
    if (!await projectAddTags(id, newData.tags)) return 0;
  }
  return response[0] ? getProject(id) : 0;
}



module.exports = {  getStatus,
                    getProject,
                    getAllProjectsResume,
                    createProject,
                    updateProject,
                    deleteProject,
                    projectAddTags
                  };
