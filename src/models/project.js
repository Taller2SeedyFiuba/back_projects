const { Project, 
        ProjectTag,
        Multimedia, 
        Sequelize, 
        sequelize } = require("../database");
const ProjectModel = require('./project-validator')

async function getStatus() {
    return sequelize.authenticate();
}

async function createProject(project) {
  const location = {
    type: 'Point',
    coordinates: [project.location.lng, project.location.lat]
  }
  project['location'] = location;
  let result = await Project.create(project);
  if (!result) return 0;
  const id = result.dataValues.id
  if (project.tags && project.tags.length > 0){
    //await ProjectTag.destroy({ where: { projectid : id } });
    if (!await projectAddTags(id, project.tags)){
      deleteProject(id);
      return 0;
    }
  }
  if (project.multimedia && project.multimedia.length > 0){
    if (!await projectAddMultimedia(id, project.multimedia)){
      deleteProject(id);
      return 0;
    }
  }
  return result ? getProject(id) : 0
}

async function getAllProjectsResume(params) {
  
  const searchParams = { 'include': [],
                         'attributes': ProjectModel.attributes.resume,
                         'limit': params.limit || 10,
                         'offset': (params.page - 1) * params.limit || 0,
                         'raw': true }
  
  //Search for first multimedia
  searchParams['include'].push({
    'model': Multimedia,
    'attributes': ['url'],
    'where': {
      position: 1 //First one
    }, // Set key
    required: false
  })
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
    searchParams.order = distance * 1000  //Sequelize measures distance in meters
    searchParams.attributes.push([distance,'distance'])
    searchParams.where.push(sequelize.where(distance, Sequelize.Op.lte, dist))
  }
  const result = await Project.findAndCountAll(searchParams)
  return result['rows'].map(o => {
    delete Object.assign(o, {['icon']: o['Multimedia.url'] })['Multimedia.url']
    return o
  })
}


async function getProject(id, perm){

  const include = [
    {
      'model': Multimedia,
      'attributes': ['url'],
      required: false
    },
    {
      'model': ProjectTag,
      'attributes': ['tag'],
      required: false
    }
  ]
  const searchParams = { include,
                         'attributes': ProjectModel.attributes.public,
                        }
  
  if (perm) searchParams['attributes'] = ProjectModel.attributes.publicPrivate

  const result = (await Project.findByPk(id, searchParams)).toJSON()
  console.log(result)
  result.Multimedia = result.Multimedia.map(m => m.url)
  result['tags'] = result.ProjectTags.map(t => t.tag)
  delete result['ProjectTags']

  return result
}


async function deleteProject(id){
  await ProjectTag.destroy({ where: { projectid : id } });
  await Multimedia.destroy({ where: { projectid : id } });
  return await Project.destroy({ where: { id } });
}

async function updateProject(id, newData) {
  const response = await Project.update(newData, { where: { id } });
  if (!response || !response[0]) return 0;
  if (newData.tags && newData.tags.length > 0){
    await ProjectTag.destroy({ where: { projectid : id } });
    if (!await projectAddTags(id, newData.tags)) return 0;
  }
  if (newData.multimedia && newData.multimedia.length > 0){
    await Multimedia.destroy({ where: { projectid : id } });
    if (!await projectAddMultimedia(id, newData.multimedia)) return 0;
  }
  return response[0] ? getProject(id) : 0;
}


async function projectAddTags(projectid, tags){
  let newTags = [];
  tags.forEach(tag => newTags.push({ projectid, tag }))
  return await ProjectTag.bulkCreate(newTags, { returning: true })
}

async function projectAddMultimedia(projectid, multimedia){
  let newMultimedia = [];
  let pos = 1;
  multimedia.forEach(url => {
    newMultimedia.push({ projectid, position: pos, url })
    pos += 1;
  })
  console.log(newMultimedia)
  return await Multimedia.bulkCreate(newMultimedia, { returning: true })
}



module.exports = {  getStatus,
                    getProject,
                    getAllProjectsResume,
                    createProject,
                    updateProject,
                    deleteProject,
                    projectAddTags
                  };
