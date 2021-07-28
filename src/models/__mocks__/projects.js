const project = {
  "id": 1,
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
  "id": 1,
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
  if (id == project.id) return project
  return null;
}



const getAllProjectsResume = async(searchParams) => {
  return [projectResume]
}

const createProject = async(project) => {
  return Object.assign(project, createdProject)
}

const updateProject = async(id, newData) => {
  if (id != project.id) return null;
  const data = {}
  Object.entries(newData).forEach(ent => {
    if (ent[1] != undefined){
      data[ent[0]] = ent[1]
    }
  })
  return Object.assign(project, data);
}

module.exports = {
  getProject,
  getAllProjectsResume,
  createProject,
  updateProject,
  createdProject,
  projectResume,
  project
};

