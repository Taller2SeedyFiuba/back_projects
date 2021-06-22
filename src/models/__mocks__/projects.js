//const { Project } = require('../../database/index')

//const attributes_resume = ProjectModel.attributes.resume.concat('icon').concat('multimedia')
//const public_attributes = ProjectModel.attributes.public.concat('tags').concat('multimedia')


const project = {
  "id": '1',
  "ownerid": "userid1",
  "title": "Test title 1",
  "description": "Test description 1",
  "type": "arte",
  "state": "on_review",
  "creationdate": "2020-03-03",
  "actualstage": 0,
  "location": {
    "description": "Location description",
    "lat": 120,
    "lng": 100
  },
  "stages": [
    {
      "title": "Test stage title",
      "description": "Test stage description",
      "amount": 1000
    }
  ],
  "tags": ["test1tag1", "test1tag2"],
  "multimedia": ["image1", "image2"],
  "fundedamount": 0,
  "totalamount": 1000,
  "sponsorscount": 0,
  "favouritescount": 0
}

const projectResume = {
  "id": '1',
  "ownerid": "userid1",
  "title": "Test title 1",
  "type": "arte",
  "state": "on_review",
  "location": "Location description",
  "icon": "image1"
}

const createdProject = {
  "id": '2',
  "state": "on_review",
  "creationdate": "2020-07-03",
  "actualstage": 0,
  "fundedamount": 0,
  "sponsorscount": 0,
  "favouritescount": 0
}



//Aux function

const pick = function (obj, attrs) {
  return attrs.reduce(function (result, key) {
      result[key] = obj[key];
      return result;
  }, {});
};


const getProject = async(id) => {
  //const result = projects.filter(project => project.id == id)
  //if (result.length != 1) return null;
  //return result[0]
  if (id == project.id) return project
  return null;
}



const getAllProjectsResume = async(searchParams) => {
  //Devuelvo siempre todo, no creo que tenga sentido implementar un filtrado.

  //return projects.map(project => {
  //  const res = pick(project, attributes_resume)
  //  if (!res.multimedia || !res.multimedia[0]) return null;
  //  res['icon'] = res.multimedia[0]
  //  delete res['multimedia']
  //  return res
  //})

  return [projectResume]
}

const createProject = async(project) => {
  //const creationdate = '2021-05-05'
  //const id = projects.length + 1
  //const state = 'on_review'
  /*SI SE QUIERE MODIFICAR LA BASE -> TESTS DE INTEGRACION
  projects.push({id,
                 ...project,
                 ...creationdate})
  */
  //return Object.assign(pick(project, public_attributes), {id, creationdate, stage})
  return Object.assign(project, createdProject)
}

const updateProject = async(id, newData) => {
  //const idx = projects.map(project => project.id).indexOf(id)
  //if (idx < 0) return null
//
  ////projects[idx] = { ...newData }  <- Si se quiere modificar la base es necesario esto.
  //return { ...projects[idx],
  //         ...newData }
  if (id != project.id) return null;
  const data = {}
  Object.entries(newData).forEach(ent => {
    if (ent[1] != undefined){
      data[ent[0]] = ent[1]
    }
  })
  return Object.assign(project, data);
}

const deleteProject = async(id) => {
  //const idx = projects.map(project => project.id).indexOf(id)
  //console.log(idx)
  //if (idx < 0) return null
  //const project = projects[idx]
  ////projects.splice(idx, 1)     <- Si se quiere modificar la base es necesario esto.
//
  //return project
  if (id != project.id) return null;
  return project
}


module.exports = {
  getProject,
  getAllProjectsResume,
  createProject,
  updateProject,
  deleteProject,
  createdProject,
  projectResume,
  project
};

