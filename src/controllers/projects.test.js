const {
    listProjects,
    getProject,
    createProject,
    updateProject
  } = require('./projects');

const errMsg = require("../errors/messages")
const { ApiError } = require("../errors/ApiError");

jest.mock('../models/projects');
jest.mock('../database/index');

const {
  project,
  projectResume,
  createdProject
} = require('../models/__mocks__/projects')


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('/getProject successful response', async () => {
  const req = {
    params: {
      id: 1
    }
  }
  const resObj = {
    data: {
      status: 'success',
      data: project
    }
  };

  const res = mockResponse();

  await getProject(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});


test('/getProject error, not found', async () => {
  const req = {
    params: {
      id: 100 //Not exists
    }
  }

  const res = mockResponse();
  const expectedError = ApiError.notFound(errMsg.PROJECT_NOT_FOUND);

  expect.assertions(2);

  try {
    await getProject(req, res);
  } catch(err){
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toEqual(expectedError);
  }
});


test('/listProjects successful response', async () => {
  const req = {
    query: {}
  };

  const resObj = {
    data: {
      status: 'success',
      data: [
        projectResume
      ]
    }
  };

  const res = mockResponse();

  await listProjects(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/listProjects error, bad format', async () => {
  const req = {
    query: {
      limit: -1 //Must be positive
    }
  }

  const res = mockResponse();

  expect.assertions(2);

  try {
    await listProjects(req, res);
  } catch(err){
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 400);  //bad request
  }
});



test('/createProject successful response', async () => {
  const sendProject = {
    "ownerid": "userid2",
    "title": "Test title 2",
    "description": "Test description 2",
    "type": "arte",
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
  }

  const req = {
    body: sendProject
  }

  const resObj = {
    data: {
      status: 'success',
      data: {...sendProject, ...createdProject}
    }
  }

  const res = mockResponse();

  await createProject(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/createProject error, wrong body', async () => {
  const sendProject = {
    "ownerid": "userid2",
    "title": "Test title 2",
    "description": "Test description 2",
    "type": "not-exists", //Bad parameter
    "location": {
      "description": "Location description",
      "lat": -1, //Bad parameter
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
  }

  const req = {
    body: sendProject
  }

  const res = mockResponse();

  expect.assertions(2);

  try {
    await createProject(req, res);
  } catch(err){
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 400);  //bad request
  }
});


test('/updateProject successful response', async () => {
  const req = {
    params: {
      id: 1,
    },
    query: {},
    body: {
      "description": "Test description 1 modified",
    }
  }

  const resObj = {
    data: {
      status: 'success',
      data: {
        ...project,
        'description': "Test description 1 modified"
      }
    }
  };

  const res = mockResponse();

  await updateProject(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});


test('/updateProject error, not found', async () => {
  const req = {
    params: {
      id: 100,  //Not exists
    },
    body: {
      "description": "Test description 1 modified",
    }
  }

  const res = mockResponse();
  const expectedError = ApiError.notFound(errMsg.PROJECT_NOT_FOUND);

  expect.assertions(2);

  try {
    await updateProject(req, res);
  } catch(err){
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toEqual(expectedError);
  }
});

test('/updateProject error, wrong body', async () => {
  const req = {
    params: {
      id: 1,
    },
    body: {
      "description": 1, //wrong body
    }
  }

  const res = mockResponse();

  expect.assertions(2);

  try {
    await updateProject(req, res);
  } catch(err){
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 400);
  }
});


