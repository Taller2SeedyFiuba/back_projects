const {
    listProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
  } = require('./projects');

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
      id: "1"
    },
    query: {}
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

test('/createProject successful response', async () => {
  //No importa que data le pasemos, mientras no sea data que deba generar la base
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

test('/deleteProject successful response', async () => {
  const req = {
    params: {
      id: "1",
    }
  }

  const resObj = {
    data: {
      status: 'success',
      data: project,
    }
  };

  const res = mockResponse();

  await deleteProject(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/updateProject successful response', async () => {
  const req = {
    params: {
      id: "1",
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


