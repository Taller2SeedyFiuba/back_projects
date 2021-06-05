const { 
    listProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
  } = require('./projects');

jest.mock('../models/project');
jest.mock('../proxy/proxy')

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
      data: {
        "id": "1",
        "ownerid": "userid1",
        "title": "Test title 1",
        "description": "Test description 1",
        "type": "art",
        "finishdate": "2021-09-10",
        "creationdate": "2020-03-03",
        "sponsorshipagreement": "Test sponsorship agreement",
        "seeragreement": "Test seer agreement",
        "tags": ["test1tag1", "test1tag2"],
        "multimedia": ["image1", "image2"]
      }
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
        {
          "id": "1",
          "ownerid": "userid1",
          "title": "Test title 1",
          "icon": "image1"
        }
      ]
    }
  };

  const res = mockResponse();

  await listProjects(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/createProject successful response', async () => {
  const req = {
    body: {
      "ownerid": "userid2",
      "title": "Test title 2",
      "description": "Test description 2",
      "type": "software",
      "finishdate": "2021-08-11",
      "sponsorshipagreement": "Test sponsorship agreement 2",
      "seeragreement": "Test seer agreement 2",
      "location": {
        'lat': 100,
        'lng': 30
      },
      "tags": ["test2tag1", "test2tag2"],
      "multimedia": ["imageUrl1", "imageUrl2", "imageUrl3"]
    }
  }

  const resObj = {
    data: {
      status: 'success',
      data: {
        "id": 2,
        "ownerid": "userid2",
        "title": "Test title 2",
        "description": "Test description 2",
        "type": "software",
        "creationdate": "2021-05-05",
        "finishdate": "2021-08-11",
        "sponsorshipagreement": "Test sponsorship agreement 2",
        "seeragreement": "Test seer agreement 2",
        "tags": ["test2tag1", "test2tag2"],
        "multimedia": ["imageUrl1", "imageUrl2", "imageUrl3"]
      }
    }
  };

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
      data: {
        "id": "1",
        "ownerid": "userid1",
        "title": "Test title 1",
        "description": "Test description 1",
        "type": "art",
        "finishdate": "2021-09-10",
        "creationdate": "2020-03-03",
        "sponsorshipagreement": "Test sponsorship agreement",
        "seeragreement": "Test seer agreement",
        "tags": ["test1tag1", "test1tag2"],
        "multimedia": ["image1", "image2"]
      }
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
      "title": "Test title 1 modified",
      "description": "Test description 1 modified",
      "tags": ["test1tag1modified", "test1tag2"],
      "multimedia": ["editImage1"]
    }
  }

  const resObj = {
    data: {
      status: 'success',
      data: {
        "id": "1",
        "ownerid": "userid1",
        "title": "Test title 1 modified",
        "description": "Test description 1 modified",
        "type": "art",
        "finishdate": "2021-09-10",
        "creationdate": "2020-03-03",
        "sponsorshipagreement": "Test sponsorship agreement",
        "seeragreement": "Test seer agreement",
        "tags": ["test1tag1modified", "test1tag2"],
        "multimedia": ["editImage1"]
      }
    }
  };

  const res = mockResponse();

  await updateProject(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});