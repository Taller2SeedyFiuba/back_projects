const { ApiError } = require("./ApiError");


function msErrorHandler(err) {
  const { response, request } = err;

  if (response) {
    throw new ApiError(response.status, response.data.error);
  } else if (request) {
    throw ApiError.dependencyError('back-users-req-error');
  } else {
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
      "error": error.message
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
    "error": "Error on server"
  })
}

module.exports = {
  notDefinedHandler,
  errorHandler,
  msErrorHandler
}
