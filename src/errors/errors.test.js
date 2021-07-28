const { ApiError } = require('./ApiError');
const {
  errorHandler
} = require('./handler');
const errMsg = require('../errors/messages')

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('/errorHandler ApiError', async () => {
  const req = {}
  const resObj = {
    data: {
      status: 'error',
      message: 'error-message'
    }
  }
  const err = new ApiError(400, 'error-message')

  const res = mockResponse();
  await errorHandler(err, req, res, undefined);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
})

test('/errorHandler axiosError with response error', async () => {
  const req = {}
  const resObj = {
    data: {
      status: 'error',
      message: 'error-message'
    }
  }
  const err = {
    isAxiosError: true,
    response: {
      status: 400,
      data: resObj.data
    }
  }

  const res = mockResponse();
  await errorHandler(err, req, res, undefined);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
})

test('/errorHandler axiosError with request error', async () => {
  const req = {}
  const resObj = {
    data: {
      status: 'error',
      message: errMsg.INTERNAL_REQ_ERROR
    }
  }
  const err = {
    isAxiosError: true,
    request: {
      'requestATT1': 'internal-info-about-error'
    }
  }

  const res = mockResponse();
  await errorHandler(err, req, res, undefined);

  expect(res.status).toHaveBeenCalledWith(502);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
})

test('/errorHandler axiosError with internal error', async () => {
  const req = {}
  const resObj = {
    data: {
      status: 'error',
      message: errMsg.INTERNAL_ERROR
    }
  }
  const err = {
    isAxiosError: true
  }

  const res = mockResponse();
  await errorHandler(err, req, res, undefined);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
})
