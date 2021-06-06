const ProjectModel = require('../project-validator')

const attributes_resume = ProjectModel.attributes.resume.concat('icon').concat('multimedia')
const public_attributes = ProjectModel.attributes.public.concat('tags').concat('multimedia')


const projects = [{
  "id": '1',
  "ownerid": "userid1",
  "title": "Test title 1",
  "description": "Test description 1",
  "type": "art",
  "stage": "funding",
  "finishdate": "2021-09-10",
  "creationdate": "2020-03-03",
  "sponsorshipagreement": "Test sponsorship agreement",
  "seeragreement": "Test seer agreement",
  "location": {
    "lat": 120,
    "lng": 100
  },
  "tags": ["test1tag1", "test1tag2"],
  "multimedia": ["image1", "image2"]
}]



//Aux function

const pick = function (obj, attrs) {
  return attrs.reduce(function (result, key) {
      result[key] = obj[key];
      return result;
  }, {});
};


const getProject = async(id, perm) => {
  const result = projects.filter(project => project.id == id)
  if (result.length != 1) return null;
  return result[0]
}



const getAllProjectsResume = async(searchParams) => {
  //Devuelvo siempre todo, no creo que tenga sentido implementar un filtrado.
  
  return projects.map(project => {
    const res = pick(project, attributes_resume)
    if (!res.multimedia || !res.multimedia[0]) return null;
    res['icon'] = res.multimedia[0]
    delete res['multimedia']
    return res
  })
}

const createProject = async(project) => {
  const creationdate = '2021-05-05'
  const id = projects.length + 1
  const stage = 'funding'
  /*SI SE QUIERE MODIFICAR LA BASE -> TESTS DE INTEGRACION
  projects.push({id,
                 ...project,
                 ...creationdate})
  */
  return Object.assign(pick(project, public_attributes), {id, creationdate, stage})
}

const updateProject = async(id, newData) => {
  const idx = projects.map(project => project.id).indexOf(id)
  if (idx < 0) return null

  //projects[idx] = { ...newData }  <- Si se quiere modificar la base es necesario esto.
  return { ...projects[idx],
           ...newData }
}

const deleteProject = async(id) => {
  const idx = projects.map(project => project.id).indexOf(id)
  console.log(idx)
  if (idx < 0) return null
  const project = projects[idx]
  //projects.splice(idx, 1)     <- Si se quiere modificar la base es necesario esto.

  return project
}


module.exports = { 
  getProject,
  getAllProjectsResume,
  createProject,
  updateProject,
  deleteProject
};

