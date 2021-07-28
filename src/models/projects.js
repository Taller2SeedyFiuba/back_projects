const { Project,
        Sequelize,
        sequelize } = require("../database");
const ProjectTags = require("./project-tag")
const Multimedia = require("./multimedia")
const Stages = require("./stages")

async function createProject(project) {

  project.locationdescription = project.location.description,
  project.location = {
    type: 'Point',
    coordinates: [project.location.lng, project.location.lat]
  }

  const result = await Project.create(project);
  if (!result) return 0;
  const id = result.dataValues.id

  if (!await Stages.projectAddStages(id, project.stages)){
    deleteProject(id);
    return 0;
  }

  if (project.tags && project.tags.length > 0){
    if (!await ProjectTags.projectAddTags(id, project.tags)){
      deleteProject(id);
      return 0;
    }
  }

  if (project.multimedia && project.multimedia.length > 0){
    if (!await Multimedia.projectAddMultimedia(id, project.multimedia)){
      deleteProject(id);
      return 0;
    }
  }

  return result ? await getProject(id) : 0
}

async function getAllProjectsResume(params) {

  const searchParams = { 'include': [],
                         'attributes': Project.attributes.resume,
                         'limit': params.limit || 10,
                         'offset': (params.page - 1) * params.limit || 0,
                         'order': [['id', 'asc']],
                          subQuery: false
                        }
  //Search for first multimedia
  searchParams.include.push({
    'model': Multimedia.getModel(),
    'attributes': ['url'],
    'where': {
      position: 1 //First one
    }, // Set key
    required: false
  })
  if (params.filters){
    searchParams.where = [{}]
    Object.entries(params.filters).forEach(a => {
      if (a[0] != 'tags' && a[0] != 'location'){
        searchParams.where[0][a[0]] = a[1]
      }
    })
  }

  if (params.filters && params.filters.tags){
    searchParams.include.push({
      'model': ProjectTags.getModel(),
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
    const dist = Number(params.filters.location.dist) * 1000 //Sequelize measures distance in meters
    const location = sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
    const distance = sequelize.fn('ST_DistanceSphere', sequelize.col("location"), location);

    searchParams.order = distance
    searchParams.where.push(sequelize.where(distance, Sequelize.Op.lte, dist))
  }

  let result = await Project.findAll(searchParams)
  result = result.map(record => record.get({ plain: true }))

  result = result.map(project => {
    project.icon = (project['Multimedia'].length == 0) ? null : project['Multimedia'][0].url
    if (project.distance) project.distance /= 1000; //Sequelize measures distance in meters
    project.location = project.locationdescription

    delete project['Multimedia']
    delete project['locationdescription']
    return project
  })

  return result
}


async function getProject(id){

  const include = [
    {
      'model': Multimedia.getModel(),
      'attributes': ['url'],
      required: false
    },
    {
      'model': ProjectTags.getModel(),
      'attributes': ['tag'],
      required: false
    },
    {
      'model': Stages.getModel(),
      'attributes': ['title', 'description', 'amount'],
      required: true
    }
  ]

  const searchParams = {
    include,
    attributes: Project.attributes.public,
    order: [
      [Stages.getModel(), 'position', 'asc'],
      [Multimedia.getModel(), 'position', 'asc']
    ]
  }

  let result = await Project.findByPk(id, searchParams)
  if (!result) return null;

  //Data formating
  result = result.toJSON()
  result.multimedia = result.Multimedia.map(m => m.url)
  result.tags = result.ProjectTags.map(t => t.tag)
  result.stages = result.Stages

  result.location = {
    'description': result.locationdescription,
    'lat': result.location.coordinates[1],
    'lng': result.location.coordinates[0]
  }

  result.totalamount = "" + result.stages.reduce((t, {amount}) => t + Number(amount), 0)

  delete result['ProjectTags']
  delete result['locationdescription']
  delete result['Multimedia']
  delete result['Stages']

  return result
}

async function updateProject(id, newData) {
  const response = await Project.update(newData, { where: { id } });
  if (!response || !response[0]) return 0;
  return response[0] ? await getProject(id) : 0;
}


const castAndCumulateMetric = function(data){
  if (!data) return null
  let sum = 0;
  return data.map(elem => {
    sum += Number(elem.metric)
    elem.metric = sum
    return elem
  })
}

const getProjectMetrics = async(params) => {
  aggDateFunction = sequelize.fn('date_trunc', params.timeinterval || 'day', sequelize.col('creationdate'))
  console.log(params)
  const searchParams = {
    'group': [aggDateFunction],
    'attributes': [
      [aggDateFunction, 'timestamp'],
      [sequelize.fn('COUNT', aggDateFunction), 'metric']
    ],
    'where': {
      'creationdate': {
        [Sequelize.Op.gte]: params.fromdate || '1800-01-01',
        [Sequelize.Op.lte]: params.todate || '2200-01-01'
      },
    },
    'order': [[aggDateFunction, 'ASC']],
    'raw': true
  }

  const projectsbystate = await Project.findAll({
    'group': 'state',
    'attributes': [
      'state',
      [sequelize.cast(sequelize.fn('COUNT', '*'), 'integer'), 'metric']
    ],
    'raw': true
  })

  Project.enums.state.forEach(function(state){
    if(!projectsbystate.find(function(elem){ return elem.state == state })){
      projectsbystate.push({
        state,
        metric: 0
      })
    }
  })

  const projectsbytype = await Project.findAll({
    'group': 'type',
    'attributes': [
      'type',
      [sequelize.cast(sequelize.fn('COUNT', '*'), 'integer'), 'metric']
    ],
    'raw': true
  })

  Project.enums.type.forEach(function(type){
    if(!projectsbytype.find(function(elem){ return elem.type == type })){
      projectsbytype.push({
        type,
        metric: 0
      })
    }
  })

  const result = {
    'projectshistory': castAndCumulateMetric(await Project.findAll(searchParams)),
    projectsbystate,
    projectsbytype
  }

  return result
}


module.exports = {
  getProject,
  getAllProjectsResume,
  createProject,
  updateProject,
  getProjectMetrics
};
