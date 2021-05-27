const { ApiError } = require("./ApiError");

function msErrorHandler(err) {
  const { response, request, message } = err;

  if (response) {
    console.log(response.data, response.status);
    throw new ApiError(response.status, response.data.error);
  } else if (request) {
    console.log(request);
    throw ApiError.dependencyError('back-users-req-error');
  } else {
    console.log('Error', message);
    throw ApiError.dependencyError('back-users-unavailable');
  }
}

function notDefinedHandler(req, res, next) {
  //Create error msg
  let error = ApiError.notFound("Asked resource do not exists")
  next(error);
}

function errorHandler(error, req, res, next) {
  if (error instanceof ApiError) {
    return res.status(error.code).json({
      "status": "error",
      "message": error.message
    })
  }
  if (error instanceof Error) {
    if (error.status && error.status < 500) {
      return res.status(error.status).json({
        "status": "error",
        "error": error.message
      })
    }
  }

  console.error("SERVER ERROR: " + error.message);
  return res.status(500).json({
    "status": "error",
    "error": "internal-server-error"
  })
}

const hocError = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  notDefinedHandler,
  msErrorHandler,
  errorHandler,
  hocError
}